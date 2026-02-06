Feature roi investor phase :

1/ tier_0 :
one simulation
1.a/ the financial design:
there should be a simple property price and a simple loan(monthly)  input and nightly price input
1.b/the monthly expenses:
there should be a simple bills/hoa input box
1.c/ the seasonlity logic :
there should only be a static value of 65% (not modifiable)

2/ tier_1 :
5 simulations

2.a/the financial design:
there should be a property price input box
there should be a simple loan calculator (down paiement, total loan, years, interest rate) and that should compute the loan monthly paiementvand a nightly price input box
2.b/the monthly expenses:
there should be a little more advanced costs breakdown (wifi, electricity, gas, water.other)there should be a simple loan box populated by the financial design loan simulation
2.cthe seasonlity logic :
an input box to enter the occupancy rate alternatively there should be a simple slider from 0 to 100 to chose le occupancy rate

3/ tier_2 :
20 simulations

3.athe financial design:
there should be a property price input box
there should be a simple loan calculator (down paiement, total loan, years, interest rate) and that should compute the loan monthly paiement and display a graph on the right of capital vs interests over time.
and a nightly price input box
3.bthe monthly expenses:
there should be a little more advanced costs breakdown (wifi, electricity, gas, water, other)
there should be a simple loan box populated by the financial design loan simulation.
there should be graph on the right showing the monthly expenses and how they vary (based on the occancy rate) by month over the year
3.cthe seasonlity logic :
an input box to enter the occupancy rate alternatively ther should be a simple slider from 0 to 100 to chose le occupancy rate.
the occupancy rate can be changed by month and the input value or slider will apply a "factor" on the monthly rates.

4/ tier_3 :
unlimited simulations
4.1/a section to capture property localisation
country where the host is living
a section to capture the house localisation
a section to basic property caracteristics (number of rrom, garden size, swimming pool ... and other aspect that can influence property price.
An option box to provide more details
once the information is captured and saved into the db  the ai should be called and proived information to ease the completion of the form. for example average price of such type of property in that location, average interest rate in that region, varible costs information, seasonlaty and nightly prices by month in this area.
taxes briefing about local obligations and potential inpact

4.2/ the financial design:
there should be a property price input box
there should be a simple loan calculator (down paiement, total loan, years, interest rate) and that should compute the loan monthly paiement and display a graph on the right of capital vs interests over time. (if not yet filled by the user prefill with values from ia (see above)
the nightly price will be in the seasonlaty section.
a simple taxes calculation based on some future owner inputs
4.3/ the monthly expenses:
there should be a little more advanced costs breakdown (wifi, electricity, gas, water, other)
there should be a simple loan box populated by the financial design loan simulation.
there should be graph on the right showing the monthly expenses and how they vary (based on the occancy rate) by month over the year
this information shall be filled initally by the ai
4.4/ the seasonlity logic :
an input box to enter the occupancy rate 
alternatively ther should be a simple slider from 0 to 100 to chose le occupancy rate.
the occupancy rate can be changed by month and the input value or slider will apply a "factor" on the monthly rates.
the nightly price by month initially filled by the ai

5/ final report
there should be a final report assessing the profitability of the investment, the reprot shall only use the data that is available for the tier of the user and shall be increasingly complete as we move to upper tiers.
for tier_0 the report shall only show the net clashflow and profitbility percentage
for tier_1 it should showreport for tier_0 and a ten yers cashflow and profitability chart
for tier_2 it show tier_1 plus a simplified P&L and a graph showing yearly P&L over next 10 years
for tier_3 it shows tier_2 , the P&L shall consider the potential taxes that the owner may incur and and a detailed analysis of the investment profitability, highlighting fincacial (taxes obligations) and the ptential risk or challenges that the future owner may face.



Smart Capex Planner feature:

1/ tier_0
1.a/ the Room Budget Planner
- add 1 room
1.b/ Spend Distribution
- not available
1.c/ handshake Vendor Matrix 
- not available
1.d/ ai quote analysis
- not available

2/ tier_1
1.a/ the Room Budget Planner
- add 3 room
1.b/ Spend Distribution
- shows the % of spend per room chart and relative number %
1.c/ handshake Vendor Matrix 
- attach up to 1 quote as pdf format
1.d/ ai quote analysis
- not available

3/ tier_2
1.a/ the Room Budget Planner
- add up to 6 rooms
1.b/ Spend Distribution
- shows the % of spend per room chart and relative number %
1.c/ handshake Vendor Matrix 
- attach up to 3 qutoes, as pdf format
1.d/ ai quote analysis
- not available

4/ tier_4
1.a/ the Room Budget Planner
- add unlimited number of rooms
1.b/ Spend Distribution
- shows the % of spend per room chart and relative number %
1.c/ handshake Vendor Matrix 
- attach up to 5 quotes, as pdf format
1.d/ ai quote analysis
- the ai quote analysis should analyse the budget planner and look at the attached quotes, analyse them and provide a wise advice regarding the construction work that is being planned. if details regarding the property location can be extracted, use them to fill in the property details.
