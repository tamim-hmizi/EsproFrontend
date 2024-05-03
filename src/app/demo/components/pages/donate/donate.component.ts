import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Fundraiser } from './../../../api/fundraiser';
import { loadStripe, RedirectToCheckoutOptions, Stripe } from '@stripe/stripe-js';
import axios from 'axios';
import { ethers } from 'ethers';
import { Donation } from 'src/app/demo/api/donation';
import { DonationService } from '../../../service/donation.service';

declare var window: any;

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css'],
})
export class DonateComponent implements OnInit {
  donationForm: FormGroup;
  stripePromise: Promise<Stripe | null>;
  amountErrors: any;
  isConnected: boolean = false;
  connectedAddress: string = '';
  fundraisers: Fundraiser[] = [];
  selectedFundraiser: Fundraiser | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private donationService: DonationService) {
    this.donationForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(5), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      paymentMethod: ['card', Validators.required]
    });
    this.stripePromise = loadStripe('pk_test_51MiH0TA3Jv9j1LNNWwj9VFmOWFU0BxjWSaaOhXX0X8H5N0GbS90VdN6x0zDQSGL02epbzoyFBoShxi3rm8CDPOVU00NKltOovb');
  }

  ngOnInit(): void {
    this.fetchFundraisers();
    if (this.donationForm) {
      const amountControl = this.donationForm.get('amount');
      if (amountControl) {
        amountControl.valueChanges.subscribe(() => {
          this.amountErrors = amountControl.errors;
        });
      }
    }
  }

  fetchFundraisers(): void {
    this.http.get<Fundraiser[]>('http://localhost:8089/esprobackend/fundraiser/retrieve-all-fundraisers')
      .subscribe(
        (data: Fundraiser[]) => {
          this.fundraisers = data.map(fundraiser => {
            // Decode base64 image and assign to displayPicture property
            const imageUrl = 'data:image/png;base64,' + fundraiser.displayPicture;
            return { ...fundraiser, displayPicture: imageUrl };
          });
        },
        (error) => {
          console.error('Error fetching fundraisers:', error);
        }
      );
  }


  selectFundraiser(fundraiser: Fundraiser): void {
    this.selectedFundraiser = fundraiser;
  }

  async submitDonation() {
    if (this.donationForm.invalid || !this.selectedFundraiser) {
      return;
    }

    const amount = this.donationForm.value.amount;
    const paymentMethod = this.donationForm.value.paymentMethod;

    console.log('Donation amount:', amount);
    console.log('Selected payment method:', paymentMethod);

    if (paymentMethod === 'card') {
      await this.redirectToStripeCheckout();
    } else if (paymentMethod === 'paypal') {
      this.initiatePaypalCheckout(amount);
    } else if (paymentMethod === 'crypto') {
      initiateCryptodonate(amount, "0xF75bD3adC93F29D5f4235F1a60B19628575B1b16");
    } else {
      console.error('Invalid payment method:', paymentMethod);
    }
  }

  async redirectToStripeCheckout() {
    const amount = this.donationForm.value.amount;

    this.http.post<any>('http://localhost:8089/esprobackend/donation/api/create-checkout-session', { amount }).subscribe(response => {
      const sessionId = response.sessionId;
      const donationId = response.donationId;

      this.stripePromise.then(stripe => {
        if (stripe) {
          stripe.redirectToCheckout({
            sessionId: sessionId
          }).then((result) => {
            if (result.error) {
              console.error(result.error);
            } else {
              // Handle successful payment
            }
          });
        } else {
          console.error('Stripe.js has not loaded yet.');
        }
      });
    }, error => {
      console.error('Error creating checkout session:', error);
    });
  }
  

  initiatePaypalCheckout(amount: number) {
    console.log('Initiating PayPal checkout for amount:', amount);

    const requestData = {
      method: 'Paypal',
      amount: amount.toString(),
      currency: 'USD',
      description: 'Donation'
    };

    this.http.post('http://localhost:8089/esprobackend/paypal', requestData, { responseType: 'text' })
      .subscribe(
        (response: string) => {
          console.log('PayPal approval URL:', response);
          window.location.href = response;
        },
        (error) => {
          console.error('Error initiating PayPal checkout:', error);
        }
      );
  }
}

async function initiateCryptodonate(amountInUSD: number, recipientAddress: string) {
    try {
        // Fetch the current exchange rate for Ethereum to USD from CoinGecko API
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const ethToUSD = response.data.ethereum.usd;

        // Convert the donation amount from USD to Ether
        const amountInEth = amountInUSD / ethToUSD;

        let provider;
        let signer;

        if (window.ethereum == null) {
            // If MetaMask is not installed, use the default provider
            console.log("MetaMask not installed; using read-only defaults");
            provider = ethers.getDefaultProvider();
        } else {
            // Connect to the MetaMask EIP-1193 object
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
        }

        // Get write access as an account by getting the signer
        if (!signer) {
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
        }

        // Convert the amount from Ether to wei using parseEther
        const amountInWei = ethers.parseEther(amountInEth.toString());

        // Send transaction with the converted amount in wei
        const tx = await signer.sendTransaction({
            to: recipientAddress,
            value: amountInWei,
        });

        // Wait for the transaction to be mined
        await tx.wait();

        console.log('Crypto donation successful');
        // Update UI accordingly
    } catch (error) {
        console.error('Error donating crypto:', error);
        // Handle error and update UI
    }
}