document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault(); 
      fillForm({
        SIO: 54.2,
        ALO: 12.8,
        FEO: 4.8,
        CAO: 8.5,
        MGO: 3.1,
        NAO: 4.8,
        KO: 1.1,
        TIO: 0.5,
        MNO: 0.1,
        SO: 10.8,
        PO: 0.2,
        IDT: 1298,
        ST: 1490,
        HT: 1590,
        FT: 1570,
        S: 0.9
      })
    }
  });

  function fillForm(data) {
    for (const key in data) {
        const input = document.querySelector(`input[name="${key}"]`);
        if (input) {
            input.value = data[key];
        }
    }
}
  
function parseFormData(formData) {
    const keys = [
        'SIO', 'ALO', 'FEO', 'CAO', 'MGO', 'NAO', 'KO', 'TIO', 'MNO', 'SO', 'PO',
        'IDT', 'ST', 'HT', 'FT', 'S'
    ];

    let parsedValues = {};
    keys.forEach(key => {
        parsedValues[key] = parseFloat(formData.get(key));
    });

    const SIO = parsedValues['SIO'];
    const ALO = parsedValues['ALO'];
    const FEO = parsedValues['FEO'];
    const CAO = parsedValues['CAO'];
    const MGO = parsedValues['MGO'];
    const NAO = parsedValues['NAO'];
    const KO = parsedValues['KO'];
    const TIO = parsedValues['TIO'];
    const MNO = parsedValues['MNO'];
    const SO = parsedValues['SO'];
    const PO = parsedValues['PO'];
    const IDT = parsedValues['IDT'];
    const ST = parsedValues['ST'];
    const HT = parsedValues['HT'];
    const FT = parsedValues['FT'];
    const S = parsedValues['S'];
    
    console.log(parsedValues)

    return parsedValues;
}

function calculateValues(parsedValues) {
   const { SIO, ALO, FEO, CAO, MGO, NAO, KO, TIO, MNO, SO, PO, IDT, ST, HT, FT, S } = parsedValues;
    const results = {};

    // T250 Temperature test value
    const T250 = Math.sqrt(
        ((((0.00835 * SIO) + (0.00601 * ALO) - 0.109) * 10**7) /
        2.398) - ((0.0415 * SIO) + (0.0192 * ALO) +
        (0.276 * FEO) + (0.016 * CAO) - 3.92))+ 150;
    results['T250'] = T250;

    // T250 Temperature score
    let T250S;
    if (T250 > 1275) T250S = 0;
    else if (T250 < 1200) T250S = 1;
    else T250S = 0.5;
    results['T250S'] = T250S;

    // Base/Acid Ratio test value
    const BART = (FEO + CAO + MGO + NAO + KO) /
                 (SIO + ALO + TIO);
    results['BART'] = BART;

    // Base/Acid Ratio score
    let BARS;
    if (BART < 0.5) BARS = 0;
    else if (BART > 1) BARS = 1;
    else BARS = 0.5;
    results['BARS'] = BARS;

    // Slagging Factor test value
    const SF = BART * S;
    results['SF'] = SF;

    // Slagging Factor score
    let SFS;
    if (SF < 0.6) SFS = 0;
    else if (SF > 1) SFS = 1;
    else SFS = 0.5;
    results['SFS'] = SFS;

    // Slagging Index test value
    const SIT = (HT + 4 * IDT) / 5;
    results['SIT'] = SIT;

    // Slagging Index score
    let SIS;
    if (SIT > 1343) SIS = 0;
    else if (SIT < 1149) SIS = 1;
    else SIS = 0.5;
    results['SIS'] = SIS;

    // Silica % test value
    const SPT = SIO * 100 / 
               (SIO + FEO + CAO + MGO);
    results['SPT'] = SPT;

    // Silica % score
    let SPS;
    if (SPT > 82) SPS = 0;
    else if (SPT < 30) SPS = 1;
    else SPS = 0.5;
    results['SPS'] = SPS;

    // Iron Calcium ratio test value
    const ICRT = FEO / CAO;
    results['ICRT'] = ICRT;

    // Iron Calcium ratio score
    let ICRS;
    if (ICRT < 0.31) ICRS = 0;
    else if (ICRT > 3) ICRS = 1;
    else ICRS = 0.5;
    results['ICRS'] = ICRS;

    // Iron plus Calcium test value
    const IPCT = FEO + CAO;
    results['IPCT'] = IPCT;

    // Iron plus Calcium score
    const IPCS = IPCT < 12 ? 0 : 1;
    results['IPCS'] = IPCS;

    // Fuel Slagging Potential
    const FSP = Number(T250S) + Number(BARS) + Number(SFS) + Number(SIS) + Number(SPS) + Number(ICRS) + Number(IPCS);
    results['FSP'] = FSP;

    // Fuel Slagging Potential Display
    let FSPD;
    if (FSP < 1) FSPD = "Low";
    else if (FSP > 2) FSPD = "High";
    else FSPD = "Moderate";
    results['FSPD'] = FSPD;

    // Sodium in Ash test value
    const SIAT = NAO * (46 / 62);
    results['SIAT'] = SIAT;

    // Sodium in Ash score
    let SIAS;
    if (SIAT < 1) SIAS = 0;
    else if (SIAT > 5) SIAS = 1;
    else SIAS = 0.5;
    results['SIAS'] = SIAS;

    // Total Alkali test value
    const TAT = (FEO + CAO + MGO + NAO + KO + MNO + SO + PO);
    results['TAT'] = TAT;

    // Total Alkali score
    const TAS = TAT < 2 ? 0 : 1;
    results['TAS'] = TAS;

    // Fouling factor test value
    const FFT = BART * SIAT;
    results['FFT'] = FFT;

    // Fouling factor score
    let FFS;
    if (FFT < 0.1) FFS = 0;
    else if (FFT > 0.5) FFS = 1;
    else FFS = 0.5;
    results['FFS'] = FFS;

    // Fuel fouling factor total score
    const FFFTS = Number(SIAS) + Number(TAS) + Number(FFS);
    results['FFFTS'] = FFFTS;

    // Fuel fouling factor total display
    let FFFD;
    if (FFFTS < 1) FFFD = "Low";
    else if (FFFTS > 2) FFFD = "High";
    else FFFD = "Moderate";
    results['FFFD'] = FFFD;

    return results;
}


function handleSubmit(event) {
    
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData); 

    const parsedValues = parseFormData(formData);
    console.log(parsedValues); 

    const calculatedValues = calculateValues(parsedValues);
    console.log(calculatedValues);

}
document.getElementById('formInput').addEventListener('submit', handleSubmit);
