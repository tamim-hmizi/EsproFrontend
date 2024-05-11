  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { HttpClient } from '@angular/common/http';
  import { Fundraiser } from './../../../api/fundraiser';
  import { loadStripe, RedirectToCheckoutOptions, Stripe } from '@stripe/stripe-js';
  import axios from 'axios';
  import { ethers } from 'ethers';
  import { Donation } from 'src/app/demo/api/donation';
  import { DonationService } from '../../../service/donation.service';
  import { ProgressBarModule } from 'primeng/progressbar';
  import { FundraiserService } from 'src/app/demo/service/fundraiser.service';
  import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/demo/api/user';
import { UsersService } from 'src/app/demo/service/users/users.service';



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
    totalDonations: { [fundraiserId: number]: number } = {}; 


    constructor(private formBuilder: FormBuilder, private http: HttpClient,private donationService: DonationService,private fundraiserService: FundraiserService,private userservice:UsersService) {
      this.donationForm = this.formBuilder.group({
        amount: ['', [Validators.required, Validators.min(5), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        paymentMethod: ['card', Validators.required]
      });
      this.stripePromise = loadStripe('pk_test_51MiH0TA3Jv9j1LNNWwj9VFmOWFU0BxjWSaaOhXX0X8H5N0GbS90VdN6x0zDQSGL02epbzoyFBoShxi3rm8CDPOVU00NKltOovb');
    }

    ngOnInit(): void {
      this.fetchFundraisers();
      this.getUserIdFromToken();
      if (this.donationForm) {
        const amountControl = this.donationForm.get('amount');
        if (amountControl) {
          amountControl.valueChanges.subscribe(() => {
            this.amountErrors = amountControl.errors;
          });
        }
      }

    
    }

    getUserIdFromToken(): string | null {
      const token = localStorage.getItem('jwt');
      console.log("token", token);
      if (token) {
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
        console.log("decodedToken", decodedToken);
        return decodedToken.sub; // Return the user's email (sub) from the token
      }
      return null; // Return null if token is not found or invalid
    }
    

    getUserByEmail(email: string): Promise<User | null> {
      return this.http.get<User>(`http://localhost:8089/esprobackend/api/users/getbyemail/${email}`)
        .toPromise()
        .catch(error => {
          console.error('Error searching user by email:', error);
          return null;
        });
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
            // Fetch total donations for each fundraiser
            this.fundraisers.forEach(fundraiser => {
              this.getDonationTotal(fundraiser.id);
            });
          },
          (error) => {
            console.error('Error fetching fundraisers:', error);
          }
        );
    }

    getDonationTotal(fundraiserId: number): void {
      this.fundraiserService.getTotalDonations(fundraiserId)
        .subscribe((total: number) => {
          this.totalDonations[fundraiserId] = total;
          console.log(total);
        }, (error) => {
          console.error('Error fetching total donation:', error);
        });
    }

    calculateDonationPercentage(fundraiser: Fundraiser): number {
      const totalDonation = this.totalDonations[fundraiser.id] || 0;
      if (!fundraiser.moneytocollect || totalDonation === 0) {
          return 0;
      }
      const percentage = (totalDonation / fundraiser.moneytocollect) * 100;
      return parseFloat(percentage.toFixed(2));
  }


    selectFundraiser(fundraiser: Fundraiser): void {
      this.selectedFundraiser = fundraiser;
    }

    async submitDonation(fundraiserId: number) {
      if (this.donationForm.invalid || !this.selectedFundraiser) {
        return;
      }
      
      const amount = this.donationForm.value.amount;
      const paymentMethod = this.donationForm.value.paymentMethod;
      
      try {
        // Get user's email from the JWT token
        const userEmail = this.getUserIdFromToken();
        if (!userEmail) {
          console.error('User email not found in token.');
          return;
        }
    
        // Search for user by email
        const user = await this.getUserByEmail(userEmail);
        if (!user) {
          console.error('User not found for email:', userEmail);
          return;
        }
        
        // Perform payment method specific actions
        if (paymentMethod === 'Credit/Debit Card') {
          await this.redirectToStripeCheckout();
        } else if (paymentMethod === 'Paypal') {
          this.initiatePaypalCheckout(amount);
        } else if (paymentMethod === 'Crypto') {
          await initiateCryptodonate(amount, "0xF75bD3adC93F29D5f4235F1a60B19628575B1b16");
        } else {
          console.error('Invalid payment method:', paymentMethod);
          return;
        }
        
        // Construct the donation object with user information
        const donation: Donation = {
          type: paymentMethod,
          amount: amount,
          status: 'Complete',
          fundraiserId: fundraiserId,
          user: user // Assign the user object to the user property
        };
        
        // Add the donation
        this.donationService.addDonation(donation)
          .subscribe(
            (response) => {
              console.log('Donation added successfully:', response);
              console.log('Donation:', donation); 
            },
            (error) => {
              console.error('Error adding donation:', error);
            }
          );
      } catch (error) {
        console.error('Error processing payment:', error);
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