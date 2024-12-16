describe("Validate View Token accessibility and functionality", () => {

    // Global vairable declaration for easy access
    const baseURL = "https://app.mc2.fi/tokens";
    const mobulaURL = "https://mobula.io/assets";
    const tokens = [
      { name: "Bitcoin", symbol: "BTC" },
      { name: "Ethereum", symbol: "ETH" },
      { name: "XRP", symbol: "XRP" },
    ];
    

    it(`Verifying the Price Abbreviation of the Token`, ()=>{

        cy.visit(baseURL)

        cy.xpath('/html/body/div[1]/div/main/section/div/div/main/section/div/div/div[3]/div/div/div[1]/div[3]/div[1]/div/span').invoke('text').then((text) =>{

                cy.log(text)

                const match = text.match(/^\$(\d+(\.\d+)?)([KMB])?$/); // regex action:to copare if a scenarion matches a number

      // Ensure the format matches the expected pattern
      expect(match, 'Text should match abbreviation format').to.not.be.null;

      const [_, value, decimalPart, abbreviation] = match;
      const numericValue = parseFloat(value); // Convert extracted value to a number

      // Check abbreviation based on thresholds
      if (abbreviation === 'K') {
        expect(numericValue *1000, 'Thousands range').to.be.gte(1000).and.lt(1000000);
      } else if (abbreviation === 'M') {
        expect(numericValue *1000000, 'Millions range').to.be.gte(999999).and.lt(1000000000);
      } else if (abbreviation === 'B') {
        expect(numericValue *1000000000, 'Billions range').to.be.gte(999999999);
      } else {
        // No abbreviation case: Value should be < 1000 or exactly "0"
        expect(numericValue, 'No abbreviation case').to.be.lt(1000);
      }

      // Check decimal precision: Should always be 2 decimal places
      const decimalDigits = decimalPart ? decimalPart.split('.')[1]?.length : 0;
      expect(decimalDigits, 'Decimal precision').to.be.at.most(2);
            
             })
          })
         
          

  
});
