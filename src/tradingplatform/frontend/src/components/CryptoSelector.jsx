function CryptoSelector({
  currencies,
  crypto1,
  crypto2,
  onCrypto1Change,
  onCrypto2Change,
  isPair
}) {

  return (

    <div className="crypto-section">

      <div className="form-group">

        <label htmlFor="crypto1">

          {isPair
            ? "Cryptocurrency A"
            : "Cryptocurrency"}

        </label>

        <select
          id="crypto1"
          value={crypto1}
          onChange={(event) =>
            onCrypto1Change(
              event.target.value
            )
          }
        >

          <option value="" disabled>
            Select cryptocurrency
          </option>

          {currencies.map(
            (currency) => (

              <option
                key={currency.id}
                value={currency.id}
              >

                {currency.symbol}

              </option>

            )
          )}

        </select>

      </div>


      {isPair && (

        <div className="form-group">

          <label htmlFor="crypto2">
            Cryptocurrency B
          </label>

          <select
            id="crypto2"
            value={crypto2}
            onChange={(event) =>
              onCrypto2Change(
                event.target.value
              )
            }
          >

            <option value="">
              Select second cryptocurrency
            </option>

            {currencies.map(
              (currency) => (

                <option
                  key={currency.id}
                  value={currency.id}
                  disabled={
                    String(currency.id)
                    === String(crypto1)
                  }
                >

                  {currency.symbol}

                </option>

              )
            )}

          </select>

        </div>

      )}

    </div>
  );
}


export default CryptoSelector;