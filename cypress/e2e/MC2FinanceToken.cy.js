import axios from 'axios'

describe("Validate View Token accessibility and functionality", () => {

  // Global vairable declaration for easy access
  const baseURL = "https://app.mc2.fi/tokens";
  const mobulaURL = "https://mobula.io/assets";
  const tokens = [
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "XRP", symbol: "XRP" },
  ];

  // This function is to check and compare the data accuracy

  const fetchTokenDataFromMobula = async (symbol) => {
    try {
      
      const response = await fetch(`https://mobula.io/asset/bitcoin`, {
        mode: "no-cors"
      });
     // const response = await axios.get(`${mobulaURL}/${symbol}`);
      const html = await response?.text();
      const name = html.match(/<h1[^>]*>(.*?)<\/h1>/)[1];
      return {
        price: parseFloat(html.match(/"price":(\d+(\.\d+)?)/)[1]),
        change24h: parseFloat(html.match(/"change24h":(-?\d+(\.\d+)?)/)[1]),
        name,
      };
    } catch (error) {
      console.log(error)
      throw new Error(
        `Failed to fetch token data for ${symbol}: ${error.message}`
      );
    }
  };
  const validateTokenData = (token, mobulaData) => {
    cy.get('.token-name').invoke('text').should('eq', token.name.trim());
    cy.get('.token-price')
      .invoke('text')
      .then((displayedPrice) => {
        const displayedPriceNum = parseFloat(
          displayedPrice.replace(/[^0-9.]/g, '')
        );
        const priceDeviation = Math.abs(
          (displayedPriceNum - mobulaData.price) / mobulaData.price
        );
        expect(priceDeviation).to.be.lessThan(0.05); // Assert < 5% deviation
      });

    cy.get('.price-change-24h')
      .invoke('text')
      .then((displayedChange) => {
        const displayedChangeNum = parseFloat(
          displayedChange.replace(/[^0-9.-]/g, '')
        );
        const changeDeviation = Math.abs(
          (displayedChangeNum - mobulaData.change24h) / mobulaData.change24h
        );
        expect(changeDeviation).to.be.lessThan(0.05); // Assert < 5% deviation
      });
  };

  //To iterate to each toke, Bitcoin, Ethereum, XRP

  tokens.forEach((token) => {
    it(`Verifying that the ${token.name} Token is present publicly on the Token list page`, () => {
      //Visit the App tokens page
      cy.visit(baseURL);

      cy.get(".text-main.font-semibold.break-words.text-xl").should(
        "be.visible"
      );
    });
    it(`Verifying the ${token.name} Token Name`, () => {
      //Visit the App tokens page
      cy.visit(baseURL);

      //Checking the Token Name
      cy.get(".text-main.font-semibold.break-words.text-xl")
        .should("be.visible")
        .and("contain", `${token.name}`);
    });
    it(`Verifying that the User is Redirected to the ${token.name}  page`, () => {
      //Visit the App tokens page
      cy.visit(baseURL);

      cy.get(".text-main.font-semibold.break-words.text-xl").should(
        "be.visible"
      );

      // User clicking on the Bitcoin token card
      cy.get(
        "body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > section:nth-child(2) > div:nth-child(2) > div:nth-child(1) > main:nth-child(1) > section:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(2) > div:nth-child(1)"
      )
        .contains('Bitcoin' )
        .click();
        

      //Verifying the the Title Bitcoin element with Title bitcoin is Visible - Verifying the right page is displayed
      cy.get(".text-main.font-semibold.break-words.text-xl").should(
       "be.visible"
      );
    });
  });

  it('Verify that the  Prices of Token on Mobula matches with the Prices on the MC2 Finance APP ',()=>{
    tokens.forEach((token)=>{

      cy.wrap(fetchTokenDataFromMobula(token.name.toLowerCase())).then((response)=>{
console.log(response)

        cy.visit(baseURL);
        cy.get(
          "body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > section:nth-child(2) > div:nth-child(2) > div:nth-child(1) > main:nth-child(1) > section:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(2) > div:nth-child(1)"
        )
          .contains(token.name )
          .click();

          validateTokenData(token, response)
      })

      it(`Verifying the Abbreviation of the ${token.name})`, ()=>{
         cy.get('body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > section:nth-child(2) > div:nth-child(2) > div:nth-child(1) > main:nth-child(1) > section:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)')
      })
    })  })  

  
});
