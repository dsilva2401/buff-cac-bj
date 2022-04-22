export const resources = {
  en: {
    translation: {
      socialLogin: {
        registerGoogleButton: 'Register with Google',
        continueGoogleButton: 'Continue with Google',
        registerFacebookButton: 'Register with Facebook',
        continueFacebookButton: 'Continue with Facebook',
      },
      signIn: {
        pageTitle: 'Sign In to Brij',
        pageHeaderTitle: 'Sign In',
        registerWithEmail: 'Register with Email',
        continueWithEmail: 'Continue with Email',
        emailInputPlaceholder: 'Enter email...',
        emailInputFilledPlaceholder: 'Email',
        signUpLink: 'Sign up!',
      },
      firebaseErrors: {
        'auth/invalid-email': 'Please provie a valid email',
        'auth/missing-email': 'Please provie an email',
        'auth/user-not-found': "User doesn't exist",
        'auth/wrong-password': 'Invalid email or password',
        'auth/internal-error': 'Server error occured',
        'auth/popup-closed-by-user': 'Please complete the signin process',
        'auth/invalid-credential-or-provider-id': 'Invalid credentials',
        'auth/unauthorized-domain':
          'You are accessing the website from a non secure domain.',
      },
      magicLink: {
        linkSentToastMessage: 'Check your email to get sign in link',
        magicLinkError: 'An error occurred',
        redirecting: 'Redirecting...',
      },
      productDetails: {
        ageGate: {
          title: 'Confirm your age',
          subtitle: 'Are you 21 or older?',
          confirmationButton: 'YES',
          disapprovalButton: 'NO',
          warningMessage: 'You must be 21+ to view this site!',
        },
      },
      personalDetails: {
        pageTitle: 'Complete Profile',
        firstNameInputPlaceholder: 'First Name',
        lastNameInputPlaceholder: 'Last Name',
        phoneNumberInputPlaceholder: 'Phone Number',
        continueButton: 'Continue',
        skip: `I'll do this later`,
      },
      sideMenu: {
        myProfile: 'My Profile',
        myCollection: 'My Collection',
        visitWebsite: 'Visit Website',
        signOut: 'Sign Out',
        signIn: 'Sign In',
        signOutToastMessage: 'Logout Successful',
      },
      profile: {
        pageTitle: 'Profile',
        pageHeaderTitle: 'Profile',
        firstNameInput: 'First Name',
        lastNameInput: 'Last Name',
        phoneNumberInput: 'Phone Number',
        saveChanges: 'Save Changes',
        updateToastMessage: 'Profile Updated',
      },
      collection: {
        pageTitle: 'My Collection',
        collectionPageTitle: 'My Collection',
        emptyCollectionMessage: 'No Products in your collection',
        scanCodeButton: 'Scan Code',
        scanSuccessMessage: 'Product Scanned',
        scanErrorMessage: 'Scan Error',
        invalidScanMessage: 'Not a valid Brij code',
      },
      fourZeroFour: {
        pageTitle: '404 | Not Found',
        message: 'This experience does not exist',
        learnMoreButton: 'Learn about Brij',
        learnMoreLink: 'https://brij.it/',
      },
      drawers: {
        authDrawer: {
          termsAndconditions: {
            part1: 'By registering you agree to email communications from ',
            part2: ' and accept ',
            brijBrand: " Brij's ",
            mulberryAndBrijBrand: " mulberry & Brij's ",
            link: 'Terms & Conditions',
          },
        },
        registrationDrawer: {
          successDrawer: {
            title: 'Product Registered!',
            description: 'Check your email for details',
          },
        },
        warrantyDrawer: {
          warrantyHeading: 'Manufacturer Warranty',
          expiredWarrantyHeading: 'Manufacturer Warranty Expired!',
          mulberryWarrantyHeading: 'Accident Protection by MulberryCare',
          expiredMulberryWarrantyHeading: 'Manufacturer Warranty Expired!',
          issueDate: 'Issue Date',
          expirationDate: 'Expiration Date',
          fullTermsLink: 'See full terms',
          viewDetails: 'View Details',
          detailsModal: {
            activateWarrantyHeading: 'Activate Warranty',
            updateWarrantyHeading: 'Update Details',
            description:
              'To activate your warranty please enter the purchase date and upload a dated receipt.',
            updateDescription:
              'To update your purchase details, please enter the new purchase date and upload a dated receipt.',
            activateButton: 'Activate',
            updateButton: 'Update',
            cancelButton: 'Cancel',
          },
          successDrawer: {
            title: 'Warranty Activated!',
            description: 'Check your email for details',
          },
          mulberryTable: {
            description: {
              explanationText:
                'To extend protection or file a claim, click the account activation link that was sent to your email from Mulberry. You can also reach out to Mulberry support',
              linkText: 'here',
            },
          },
        },
        referralDrawer: {
          copyLinkButton: 'Copy link',
          copyLinkToastMessage: 'Copied to clipboard',
          shareLinkButton: 'Share link',
          shareText: 'Have a look at this product from Brij',
          helpText: 'Have your friend scan this code',
        },
        smsDrawer: {
          signUpButton: 'Sign up for VIP texts',
          subscriptionDisclaimer:
            'By signing up via text, you agree to receive recurring automated personalized and promotional marketing text messages from Canopy at the cell number used when signing up. Consent is not a condition of any purchase. Reply HELP for help and STOP to cancel. Msg frequency varies. Msg & data rates may apply. Must be a resident of the US and 18 years or older. View Terms and Privacy.',
        },
        shopDrawer: {
          successDrawer: {
            title: 'Order Placed!',
            description: 'Check your email for an order confirmation',
          },
          productDetails: {
            showMore: 'More',
            showLess: 'Less',
          },
          savingBanner: {
            pre: "You're saving",
            postWithBranding: '% with Brij',
            postWithoutBranding: '%',
          },
          checkoutButton: {
            callToAction: 'Checkout',
            unavailable: 'Not Available in stock',
          },
          checkoutHint: {
            chooseOptions: 'Please choose options',
            comboUnavailable: 'Combination not available',
          },
        },
      },
    },
  },
};
