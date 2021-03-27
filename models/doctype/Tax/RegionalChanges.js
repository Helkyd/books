const frappe = require('frappejs'); //HELKYDS 05-12-2020
module.exports = async function generateTaxes(country) {
  if (country === 'India') {
    const GSTs = {
      GST: [28, 18, 12, 6, 5, 3, 0.25, 0],
      IGST: [28, 18, 12, 6, 5, 3, 0.25, 0],
      'Exempt-GST': [0],
      'Exempt-IGST': [0]
    };
    let newTax = await frappe.getNewDoc('Tax');
    for (const type of Object.keys(GSTs)) {
      for (const percent of GSTs[type]) {
        if (type === 'GST') {
          await newTax.set({
            name: `${type}-${percent}`,
            details: [
              {
                account: 'CGST',
                rate: percent / 2
              },
              {
                account: 'SGST',
                rate: percent / 2
              }
            ]
          });
        } else {
          await newTax.set({
            name: `${type}-${percent}`,
            details: [
              {
                account: type.toString().split('-')[0],
                rate: percent
              }
            ]
          });
        }
        await newTax.insert();
      }
    }
  } else if (country === 'Angola') {
    const IMPOSTOS = {
      IVA: [14],
      'Isencao-M94': ['Isento nos termos da alinea e) do nº1 do artigo 16.º'],
      'Isencao-M93': ['Isento nos termos da alinea d) do nº1 do artigo 16.º'],
      'Isencao-M92': ['Isento nos termos da alinea c) do nº1 do artigo 16.º'],
      'Isencao-M91': ['Isento nos termos da alinea b) do nº1 do artigo 16.º'],
      'Isencao-M90': ['Isento nos termos da alinea a) do nº1 do artigo 16.º'],
      'Isencao-M86': ['Isento nos termos da alinea b) do nº2 do artigo 14.º'],
      'Isencao-M85': ['Isento nos termos da alinea a) do nº2 do artigo 14.º'],
      'Isencao-M84': ['Isento nos termos da alínea e) do nº1 do artigo 14.º'],
      'Isencao-M83': ['Isento nos termos da alinea d) do nº1 do artigo 14.º'],
      'Isencao-M82': ['Isento nos termos da alinea c) do nº1 do artigo 14.º'],
      'Isencao-M81': ['Isento nos termos da alinea b) do nº1 do artigo 14.º'],
      'Isencao-M80': ['Isento nos termos da alinea a) do nº1 do artigo 14.º'],
      'Isencao-M38': ['Isento nos termos da alínea i) do artigo 15.º do CIVA'],
      'Isencao-M37': ['Isento nos termos da alínea h) do artigo 15.º do CIVA'],
      'Isencao-M36': ['Isento nos termos da alínea g) do artigo 15.º do CIVA'],
      'Isencao-M35': ['Isento nos termos da alínea f) do artigo 15.º do CIVA'],
      'Isencao-M34': ['Isento nos termos da alínea e) do artigo 15.º do CIVA'],
      'Isencao-M33': ['Isento nos termos da alínea d) do artigo 15.º do CIVA'],
      'Isencao-M32': ['Isento nos termos da alínea c) do artigo 15.º do CIVA'],
      'Isencao-M31': ['Isento nos termos da alínea b) do artigo 15.º do CIVA'],
      'Isencao-M30': ['Isento nos termos da alínea a) do artigo 15.º do CIVA'],
      'Isencao-M24': ['Isento nos termos da alínea 0) do artigo 12.º do CIVA'],
      'Isencao-M23': ['Isento nos termos da alínea n) do artigo 12.º do CIVA'],
      'Isencao-M22': ['Isento nos termos da alínea m) do artigo 12.º do CIVA'],
      'Isencao-M21': [
        'Isento nos termos da alínea l) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M20': [
        'Isento nos termos da alínea k) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M19': [
        'Isento nos termos da alínea j) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M18': [
        'Isento nos termos da alínea i) do nº1 artigo 12.º do CIVA'
      ],
      'Isencao-M17': [
        'Isento nos termos da alínea h) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M16': [
        'Isento nos termos da alínea g) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M15': [
        'Isento nos termos da alínea f) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M14': [
        'Isento nos termos da alínea e) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M13': [
        'Isento nos termos da alínea d) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M12': [
        'Isento nos termos da alínea c) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M11': [
        'Isento nos termos da alínea b) do nº1 do artigo 12.º do CIVA'
      ],
      'Isencao-M04': ['IVA – Regime de não sujeição'],
      'Isencao-M00': ['Regime Transitório'],
      'Isencao-M02': ['Transmissão de bens e serviço não sujeita'],
      'Isencao-M10': [
        'Isento nos termos da alínea a) do nº1 do artigo 12.º do CIVA'
      ]
    };
    let newTax = await frappe.getNewDoc('Tax');
    for (const type of Object.keys(IMPOSTOS)) {
      for (const percent of IMPOSTOS[type]) {
        if (type === 'IVA') {
          await newTax.set({
            name: `${type}-${percent}`,
            details: [
              {
                account: '34510000 - IVA Suportado',
                rate: percent
              }
            ]
          });
        } else {
          await newTax.set({
            name: `${type}`, // `${type}-${percent}`,
            details: [
              {
                account: '34510000 - IVA Suportado', //type.toString().split('-')[0],
                rate: 0,
                motivo: percent
              }
            ]
          });
        }
        await newTax.insert();
      }
    }
  }
};
