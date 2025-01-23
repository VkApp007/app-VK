
const products = {
    1: {
        name: "1629 Extra Virgin Olive Oil-250ml",
        image: "images/1.png",
        description: "1629 Extra Virgin Olive Oil-250ml",
        features: ["ប្រេងអូលីវ អ៊ិចស្រ្តា វើជីន ចំណុះ 250 ម.ល"]
    },
    2: {
        name: "1629 Extra Virgin Olive Oil-500ml",
        image: "images/2.png",
        description: "1629 Extra Virgin Olive Oil-500ml.",
        features: ["ប្រេងអូលីវ អ៊ិចស្រ្តា វើជីន ចំណុះ 500 ម.ល"]
    },
    3: {
        name: "1629 Extra Virgin Olive Oil-1L",
        image: "images/3.png",
        description: "1629 Extra Virgin Olive Oil-1L.",
        features: ["ប្រេងអូលីវ អ៊ិចស្រ្តា វើជីន ចំណុះ 1​ លីត្រ"]
    },
    4: {
        name: "1629 Extra Virgin Olive Oil-3L",
        image: "images/4.png",
        description: "1629 Extra Virgin Olive Oil-3.",
        features: ["ប្រេងអូលីវ អ៊ិចស្រ្តា វើជីន ចំណុះ 3​ លីត្រ"]
    },
    5: {
        name: "1629 Virgin Olive Oil-250ml",
        image: "images/5.png",
        description: "1629 Virgin Olive Oil-250ml.",
        features: ["ប្រេងអូលីវ វើជីន ចំណុះ 250 ម.ល"]
    },
    6: {
        name: "1629 Virgin Olive Oil-1L",
        image: "images/6.png",
        description: "1629 Virgin Olive Oil-1L.",
        features: ["ប្រេងអូលីវ វើជីន ចំណុះ 1 លីត្រ"]
    },
    7: {
        name: "1629 Virgin Olive Oil-3L",
        image: "images/7.png",
        description: "1629 Virgin Olive Oil-3L.",
        features: ["ប្រេងអូលីវ វើជីន ចំណុះ 3 លីត្រ"]
    },
    8: {
        name: "PALAMIDAS Glass Bottle Olive Pomace Oil-750ml",
        image: "images/8.png",
        description: "PALAMIDAS Glass Bottle Olive Pomace Oil-750ml",
        features: ["ប្រេងអូលីវ ប៉ូម៉ាស ប៉ាឡាមីដាស ចំណុះ 750ml"]
    },
    9: {
        name: "PALAMIDAS Glass Bottle Olive Pomace Oil-3L",
        image: "images/9.png",
        description: "PALAMIDAS Glass Bottle Olive Pomace Oil-3L",
        features: ["ប្រេងអូលីវ ប៉ូម៉ាស ប៉ាឡាមីដាស​ ចំណុះ 3L"]
    },
    10: {
        name: "1629 Chia Seeds-360g",
        image: "images/10.png",
        description: "1629 Chia Seeds-360g",
        features: ["គ្រាប់ឈៀ សិរីរាង្គ ម៉ាក 1629 ចំណុះ 360 ក្រាម"]
    },
    11: {
        name: "Perfect Earth Chia Seeds-225g",
        image: "images/11.png",
        description: "Perfect Earth Chia Seeds-225g",
        features: ["គ្រាប់ឈៀ សិរីរាង្គ ម៉ាក ភើហ្វិច អើស ចំណុះ 225 ក្រាម"]
    },
    12: {
        name: "Perfect Earth Chia Seeds-360g",
        image: "images/12.png",
        description: "Perfect Earth Chia Seeds-360g",
        features: ["គ្រាប់ឈៀ សិរីរាង្គ ម៉ាក ភើហ្វិច អើស ចំណុះ​ 360 ក្រាម"]
    },
    13: {
        name: "Perfect Earth Chia Seeds 12x12g: 144g",
        image: "images/13.png",
        description: "Perfect Earth Chia Seeds 12x12g: 144g",
        features: ["គ្រាប់ឈៀ សិរីរាង្គ ម៉ាក ភើហ្វិច អើស ចំណុះ 144 ក្រាម"]
    },
    14: {
        name: "Perfect Earth Organic Pasta-Padthai 225g",
        image: "images/14.png",
        description: "Perfect Earth Organic Pasta-Padthai 225g",
        features: ["មីផាស្តា សិរីរាង្គ ពណ៌ ស"]
    },
    15: {
        name: "Perfect Earth Organic Pasta-Brown 225g",
        image: "images/15.png",
        description: "Perfect Earth Organic Pasta-Brown 225g",
        features: ["មីផាស្តា សិរីរាង្គ ពណ៌ ត្នោត"]
    },
    16: {
        name: "Perfect Earth Organic Pasta-Red 225g",
        image: "images/16.png",
        description: "Perfect Earth Organic Pasta-Red 225g",
        features: ["មីផាស្តា សិរីរាង្គ ពណ៌ ក្រហម"]
    },
    17: {
        name: "Perfect Earth Organic Pasta-Black 225g",
        image: "images/17.png",
        description: "Perfect Earth Organic Pasta-Black 225g",
        features: ["មីផាស្តា សិរីរាង្គ ពណ៌ ខ្មៅ"]
    },
    18: {
        name: "Rai Wan Monk Fruit Organic-CLASSIC 200g",
        image: "images/18.png",
        description: "Rai Wan Monk Fruit Organic-CLASSIC 200g",
        features: ["ស្ករ មាំង ហ្វ្រូត ក្លាសិក ចំណុះ 200 ក្រាម"]
    },
    19: {
        name: "Rai Wan Monk Fruit Organic-MINI CLASSIC PACK 60g",
        image: "images/new01.png",
        description: "Rai Wan Monk Fruit Organic-MINI CLASSIC PACK 60g",
        features: ["ស្ករ មាំង ហ្វ្រូត ក្លាសិក ចំណុះ 60 ក្រាម (មាន​ 20 កញ្ចប់តូច)"]
    },
    20: {
        name: "Rai Wan Monk Fruit Organic-GOLDEN 200g",
        image: "images/19.png",
        description: "Rai Wan Monk Fruit Organic-GOLDEN 200g",
        features: ["ស្ករ មាំង ហ្វ្រូត ហ្គោលដិន ចំណុះ 200 ក្រាម"]
    },
    21: {
        name: "Raiwan Monkfruit Sweetener Syrup 200ml",
        image: "images/new02.png",
        description: "Rai Wan Monk Fruit Organic-MINI CLASSIC PACK 60g",
        features: ["ស្ករ មាំង ហ្វ្រូត ហ្គោលដិន ចំណុះ 60 ក្រាម (មាន​ 20 កញ្ចប់តូច)"]
    },
    22: {
        name: "Raiwan Monkfruit Sweetener Syrup 50ml",
        image: "images/20.png",
        description: "Raiwan Monkfruit Sweetener Syrup 50ml",
        features: ["ទឹកស្ករ មាំង ហ្វ្រូត ចំណុះ 50 មីលីលីត្រ"]
    },
    23: {
        name: "Date Me or Date Powder(Sugar Free) 340g",
        image: "images/21.png",
        description: "ស្ករ ល្មើ គ្មានជាតិស្ករ ចំណុះ 340 ក្រាម",
        features: ["ស្ករ ល្មើ គ្មានជាតិស្ករ ចំណុះ 340 ក្រាម"]
    },
    24: {
        name: "Khmer Healthy Earth-Cashew Nut 250gl",
        image: "images/23.png",
        description: "Khmer Healthy Earth-Cashew Nut 250g",
        features: ["គ្រាប់ស្វាយចន្ទីខ្មែរ ចំណុះ 250 ក្រាម"]
    },
    25: {
        name: "Khmer Healthy Earth-Banana Chip 160g",
        image: "images/23.png",
        description: "Khmer Healthy Earth-Banana Chip 160g",
        features: ["ចេកឆាប ទឹកដោះគោ ចំណុះ 160 ក្រាម"]
    },
    26: {
        name: "Khmer Healthy Earth-Taro Chip 160g",
        image: "images/24.png",
        description: "Khmer Healthy Earth-Taro Chip 160g",
        features: ["ត្រាវឆាប ទឹកដោះគោ ចំណុះ 160 ក្រាម"]
    },
    27: {
        name: "Kaikai Crispy Chicken Skin-Original 32g",
        image: "images/27.png",
        description: "Kaikai Crispy Chicken Skin-Original 32g",
        features: ["នំស្បែកមាន់បំពងស្រួយ កៃកៃ រសជាតិដើម 32 ក្រាម"]
    },
    28: {
        name: "Kaikai Crispy Chicken Skin-Sriracha 32g",
        image: "images/28.png",
        description: "Kaikai Crispy Chicken Skin-Sriracha 32g",
        features: ["នំស្បែកមាន់បំពងស្រួយ កៃកៃ រសជាតិស្រីរាជា 32 ក្រាម"]
    },
    29: {
        name: "Kaikai Crispy Chicken Skin-Barbecue 32g",
        image: "images/29.png",
        description: "Kaikai Crispy Chicken Skin-Barbecue 32g",
        features: ["នំស្បែកមាន់បំពងស្រួយ កៃកៃ រសជាតិបាប៊ីឃ្យូ 32 ក្រាម"]
    },
    30: {
        name: "Kaikai Crispy Chicken Skin-Mala 32g",
        image: "images/product2.png",
        description: "Kaikai Crispy Chicken Skin-Mala 32g",
        features: ["នំស្បែកមាន់បំពងស្រួយ កៃកៃ រសជាតិម៉ាឡ៉ា 32 ក្រាម"]
    },
    31: {
        name: "Prinze Head Snack-Tom Yum​​​ 75g",
        image: "images/31.png",
        description: "Prinze Head Snack-Tom Yum​​​ 75g",
        features: ["នំក្បាលបង្គាបំពងស្រួយ រសជាតិ តុងយាំ ចំណុះ 75​ ក្រាម"]
    },
    32: {
        name: "Prinze Head Snack-Salted Egg​​​ 75g",
        image: "images/32.png",
        description: "Prinze Head Snack-Salted Egg​​​ 75g",
        features: ["នំក្បាលបង្គាបំពងស្រួយ រសជាតិ ពងទាប្រៃ ចំណុះ 75​ ក្រាម"]
    },
    33: {
        name: "Prinze Head Snack-Original 75g",
        image: "images/33.png",
        description: "Prinze Head Snack-Original 75g",
        features: ["នំក្បាលបង្គាបំពងស្រួយ រសជាតិ ដើម ចំណុះ 75​ ក្រាម"]
    },
    34: {
        name: "Premium Raw Wild Honey-HONEY V​ 380ml",
        image: "images/34.png",
        description: "Premium Raw Wild Honey-HONEY V​ 380ml",
        features: ["ទឹកឃ្មុំខ្មែរព្រៃ ហាន់នី វី ចំណុះ​ 380ml"]
    },
    35: {
        name: "Nature's Charm Condensed Milk(Sugar Free)-320g",
        image: "images/35.png",
        description: "Nature's Charm Condensed Milk(Sugar Free)-320g",
        features: ["ទឹកដោះគោខាប់ធ្វើពីដូង គ្មានជាតិស្ករ 320 ក្រាម"]
    },
    36: {
        name: "Nature's Charm Condensed Milk-Normal",
        image: "images/36.png",
        description: "Nature's Charm Condensed Milk-Normal",
        features: ["ទឹកដោះគោខាប់ធ្វើពីដូង ធម្មតា"]
    },
    37: {
        name: "Nature's Charm Coconut Condensed Milk Normal-Bottle",
        image: "images/37.png",
        description: "Nature's Charm Coconut Condensed Milk Normal-Bottle",
        features: ["ទឹកដោះគោខាប់ ធ្វើពីដូង (ប្រភេទដប)"]
    },
    38: {
        name: "Nature's Charm Coconut Whipping Cream",
        image: "images/38.png",
        description: "Nature's Charm Coconut Whipping Cream",
        features: ["វីបភីងគ្រីមធ្វើពីដូង"]
    },
    39: {
        name: "Nature's Charm Coconut Evaporated",
        image: "images/39.png",
        description: "Nature's Charm Coconut Evaporated",
        features: ["ទឹកដោះគោរាវ អ៊ីវ៉ាផូរ៉េតធីត"]
    },
    40: {
        name: "Nature's Charm Oat Condensed Milk",
        image: "images/40.png",
        description: "Nature's Charm Oat Condensed Milk",
        features: ["ទឹកដោះគោខាប់ធ្វើពីស្រូវសាលី"]
    },
    41: {
        name: "Nature's Charm Oat​ Whipping Cream",
        image: "images/41.png",
        description: "Nature's Charm Oat​ Whipping Cream",
        features: ["វីបភីងគ្រីមធ្វើពីស្រូវសាលី"]
    },
    42: {
        name: "Nature's Charm Vegan Fish Sauce",
        image: "images/42.png",
        description: "Nature's Charm Vegan Fish Sauce",
        features: ["ទឹកត្រីធ្វើពីបន្លែ សារាយសមុទ្រ"]
    },
    43: {
        name: "Nature's Charm Jackfruit Confit 24x200g",
        image: "images/43.png",
        description: "Nature's Charm Jackfruit Confit 24x200g",
        features: ["ខ្នុរខ្ចីត្រាំប្រេងអូលីវ ចំណុះ 200 ក្រាម"]
    },
    44: {
        name: "Nature's Charm Vegan Scallop 24x425g",
        image: "images/44.png",
        description: "Nature's Charm Vegan Scallop 24x425g",
        features: ["ស្កាឡប់ធ្វើពីផ្សិត ចំណុះ 425 ក្រាម"]
    },
    45: {
        name: "Nature's Charm Vegan Calamari 24x425g",
        image: "images/001.png",
        description: "Nature's Charm Vegan Calamari 24x425g",
        features: ["ស្កាឡប់ធ្វើពីផ្សិត ចំណុះ 425 ក្រាម"]
    },
    46: {
        name: "Nature's Charm Vegan Calamari 24x425g",
        image: "images/45.png",
        description: "Nature's Charm Vegan Calamari 24x425g",
        features: ["ស្កាឡប់ធ្វើពីផ្សិត ចំណុះ 425 ក្រាម"]
    },
    47: {
        name: "Chef's Choice Thai Chilli Paste 24x220g",
        image: "images/46.png",
        description: "Chef's Choice Thai Chilli Paste 24x220g",
        features: ["ម្ទេសឆា ថៃ Chef's Choice 220 ក្រាម"]
    },
    48: {
        name: "WARSTEINER PREMIUM BEER ",
        image: "images/47.png",
        description: "WARSTEINER PREMIUM BEER 24 x 330ml bottle",
        features: ["GERMANY"]
    },
    49: {
        name: "WARSTEINER PREMIUM BEER 12 x 660ml bottle",
        image: "images/48.png",
        description: "WARSTEINER PREMIUM BEER 12 x 660ml bottle",
        features: ["GERMANY"]
    },
    50: {
        name: "WARSTEINER PREMIUM BEER  24 x 330ml can",
        image: "images/49.png",
        description: "WARSTEINER PREMIUM BEER  24 x 330ml can",
        features: ["GERMANY"]
    },
    51: {
        name: "WARSTEINER PREMIUM BEER  24 x 500ml can",
        image: "images/50.png",
        description: "WARSTEINER PREMIUM BEER  24 x 500ml can",
        features: ["GERMANY"]
    },
    52: {
        name: "WARSTEINER PREMIUM BEER  2 x 5000ml mini keg",
        image: "images/51.png",
        description: "WARSTEINER PREMIUM BEER  2 x 5000ml mini keg",
        features: ["GERMANY"]
    },
    53: {
        name: "WARSTEINER BREWERS GOLD  24 x 500ml can",
        image: "images/52.png",
        description: "WARSTEINER BREWERS GOLD  24 x 500ml can",
        features: ["GERMANY"]
    },
    54: {
        name: "WARSTEINER ALCOHOL FREE  24 x 330ml bottle",
        image: "images/53.png",
        description: "WARSTEINER ALCOHOL FREE  24 x 330ml bottle",
        features: ["Feature 1: PremiGERMANY"]
    },
    55: {
        name: "WARSTEINER DUNKEL  24 x 330ml bottle",
        image: "images/54.png",
        description: "WARSTEINER DUNKEL  24 x 330ml bottle",
        features: ["GERMANY"]
    },

    56: {
        name: "WARSTEINER Naturradler Lemon 24x500ml",
        image: "images/57.png",
        description: "WARSTEINER Naturradler Lemon 24x500ml",
        features: ["GERMANY"]
    },
    57: {
        name: "HAPPY TIGER-Imperial_Zweigenlt/Silver 13% 750ml Bottles",
        image: "images/58.png",
        description: "HAPPY TIGER-Imperial_Zweigenlt/Silver 13% 750ml Bottles",
        features: ["AUSTRIA"]
    },
    58: {
        name: "HAPPY TIGER-Franz Josef_Cuvee/Green 13% 750ml Bottles",
        image: "images/59.png",
        description: "HAPPY TIGER-Franz Josef_Cuvee/Green 13% 750ml Bottles",
        features: ["AUSTRIA"]
    },
    59: {
        name: "HAPPY TIGER-Duke_Blaufrankisch/Blue 13% 750ml Bottles",
        image: "images/60.png",
        description: "HAPPY TIGER-Duke_Blaufrankisch/Blue 13% 750ml Bottles",
        features: ["AUSTRIA"]
    },
    60: {
        name: "HAPPY TIGER-Rubin_Cuvee/ Red 13% 750ml Bottles",
        image: "images/61.png",
        description: "HAPPY TIGER-Rubin_Cuvee/ Red 13% 750ml Bottles",
        features: ["AUSTRIA"]
    },
    61: {
        name: "HAPPY TIGER-Gold_Royal Cuvee/ Gold13.50 % 750ml Bottles",
        image: "images/62.png",
        description: "HAPPY TIGER-Gold_Royal Cuvee/ Gold13.50 % 750ml Bottles",
        features: ["AUSTRIA"]
    },
    62: {
        name: "HAPPY TIGER-Crown_Royal Zweigelt/dark-Red 14.50% 750ml Bottles",
        image: "images/63.png",
        description: "HAPPY TIGER-Crown_Royal Zweigelt/dark-Red 14.50% 750ml Bottles",
        features: ["AUSTRIA"]
    },

    64: {
        name: "Cambodian Premium Peanut Oil-1L",
        image: "images/64.png",
        description: "Cambodian Premium Peanut Oil-1L",
        features: ["ប្រេងសណ្តែកដី កម្ពុជា"]
    },
    65: {
        name: "Cambodian Premium Peanut Oil-2L",
        image: "images/65.png",
        description: "Cambodian Premium Peanut Oil-2L",
        features: ["ប្រេងសណ្តែកដី កម្ពុជា"]
    },
};

function showDetails(button) {
    const productId = button.closest('.product-card').getAttribute('data-product-id');
    const product = products[productId];
    
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('detailed-product-image').src = product.image;
    document.getElementById('product-description').innerText = product.description;

    const featuresList = document.getElementById('product-features');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const listItem = document.createElement('li');
        listItem.innerText = feature;
        featuresList.appendChild(listItem);
    });

    document.getElementById('product-details').style.display = 'flex';
}

function hideDetails() {
    document.getElementById('product-details').style.display = 'none';
}

function filterProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').innerText.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
