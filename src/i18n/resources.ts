export const resources = {
  en: {
    translation: {
      socialLogin: {
        signInToastMessage: "Sign In Successful",
        googleButton: "Continue with Google",
        facebookButton: "Continue with Facebook"
      },
      firebaseErrors: {
        "auth/invalid-email": "Please provie a valid email",
        "auth/missing-email": "Please provie an email",
        "auth/user-not-found": "User doesn't exist",
        "auth/wrong-password": "Invalid email or password",
        "auth/internal-error": "Server error occured",
        "auth/popup-closed-by-user": "Please complete the signin process",
        "auth/invalid-credential-or-provider-id": "Invalid credentials",
        "auth/unauthorized-domain": "You are accessing the website from a non secure domain."
      },
      magicLink: {
        linkSentToastMessage: "A magic link is sent to your email",
        magicLinkError: "An error occurred",
        redirecting: "Redirecting...",
      },
      personalDetails: {
        firstNameInputPlaceholder: "First Name",
        lastNameInputPlaceholder: "Last Name",
        phoneNumberInputPlaceholder: "Phone Number",
        continueButton: "Continue",
      },
      sideMenu: {
        myProfile: "My Profile",
        myCollection: "My Collection",
        visitWebsite: "Visit Website",
        signOut: "Sign Out",
        signIn: "Sign In",
        signOutToastMessage: "Logout Successful",
      },
      profile: {
        pageHeaderTitle: "Profile",
        firstNameInput: "First Name",
        lastNameInput: "Last Name",
        phoneNumberInput: "Phone Number",
        saveChanges: "Save Changes",
        updateToastMessage: "Profile Updated",
      },
      signUp: {
        pageHeaderTitle: "Sign Up",
        signUpButton: "Sign Up",
        magicLinkButton: "Send magic link",
        emailInput: "Enter email...",
        passwordInput: "Enter password...",
        existingUser: "Already have a BRIJ account?",
        signInLink: "Sign in!",
        signUpToastMessage: "Sign Up Successful",
        usePassword: "Use password",
        useMagicLink: "Use magic link",
      },
      signIn: {
        pageHeaderTitle: "Sign In",
        signInButton: "Sign In",
        magicLinkButton: "Send magic link",
        emailInput: "Enter email...",
        passwordInput: "Enter password...",
        forgotPassword: "Forgot Password?",
        newToBrij: "New to BRIJ?",
        signUpLink: "Sign up!",
        signInToastMessage: "Login Successful",
        usePassword: "Use password",
        useMagicLink: "Use magic link",
      },
      forgotPassword: {
        pageHeaderTitle: "Forgot Password",
        emailInput: "Enter email...",
        sendEmailLink: "Email me a Link!",
      },
      collection: {
        collectionPageTitle: "My Collection",
        emptyCollectionMessage: "No Products in your collection",
        scanCodeButton: "Scan Code",
        scanSuccessMessage: "Product Scanned",
        scanErrorMessage: "Scan Error",
        invalidScanMessage: "Not a valid Brij code",
      },
      fourZeroFour: {
        message: "This experience does not exist",
        learnMoreButton: "Learn about Brij",
        learnMoreLink: "https://brij.it/",
      },
      productDetails: {
        addToCollection: "Add to collection",
        removeFromCollection: "Remove from collection",
      },
      drawers: {
        registrationDrawer: {
          signInDisclaimer:
            "By registering you agree to email communications from Gucci and accept Brij’s Terms & Conditions",
          emailRegisterButton: "Register with Email",
          googleButton: "Register with Google",
          facebookButton: "Register with Facebook",
          emailInput: "Enter email...",
          successDrawer: {
            title: "Product Regsitered!",
            description: "Check your email for details",
          },
          detailsForm: {
            title: "Complete your profile",
            firstNameInput: "Enter first name...",
            lastNameInput: "Enter last name...",
            phoneNumberInput: "Enter phone number...",
            passwordInput: "Enter password...",
            confirmPasswordInput: "Confirm password...",
            submitButton: "Submit",
            doLaterButton: "I'll do this later",
          },
        },
        warrantyDrawer: {
          signInDisclaimer:
            "By registering you agree to email communications from Gucci and accept Brij’s Terms & Conditions",
          registerButton: "Register with Email",
          googleButton: "Continue with Google",
          facebookButton: "Continue with Facebook",
          emailInput: "Enter email...",
          details: "Details",
          duration: "Duration",
          status: "Status",
          purchaseDate: "Purchase Date",
          expires: "Expires",
          changePurchaseDetails: "Change Purchase Details",
          activateDetails: "Activate Warranty",
          detailsModal: {
            activateWarrantyHeading: "Activate Warranty",
            updateWarrantyHeading: "Update Details",
            description:
              "To activate your warranty please enter the purchase date and upload a dated receipt.",
            updateDescription:
              "To update your purchase details, please enter the new purchase date and upload a dated receipt.",
            activateButton: "Activate",
            updateButton: "Update",
            cancelButton: "Cancel",
          },
          successDrawer: {
            title: "Warranty Activated!",
            description: "Check your email for details",
          },
        },
        referralDrawer: {
          copyLinkButton: "Copy link",
          copyLinkToastMessage: "Copied to clipboard",
          shareLinkButton: "Share link",
          shareText: "Have a look at this product from Brij",
          helpText: "Have your friend scan this code",
        },
        smsDrawer: {
          signUpButton: "Sign up for VIP texts",
          subscriptionDisclaimer:
            "By signing up via text, you agree to receive recurring automated personalized and promotional marketing text messages from Canopy at the cell number used when signing up. Consent is not a condition of any purchase. Reply HELP for help and STOP to cancel. Msg frequency varies. Msg & data rates may apply. Must be a resident of the US and 18 years or older. View Terms and Privacy.",
        },
        shopDrawer: {
          successDrawer: {
            title: "Order Placed!",
            description: "Check your email for an order confirmation",
          },
          savingBanner: {
            pre: "You're saving ",
            post: "% with Brij",
          },
          checkoutButton: {
            purchaseNow: "Purchase Now!",
            unavailable: "Not Available in stock",
          },
          checkoutHint: {
            chooseOptions: "Please choose options",
            comboUnavailable: "Combination not available",
          },
        },
      },
    },
  },
};
