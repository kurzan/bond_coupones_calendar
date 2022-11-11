const calendarWindget = document.querySelector('.coupone-calendar-widget');
const tableBody = document.querySelector('.coupone-table__body');
const bondTitle = document.querySelector('.bond_title');
const bondTextCoupons = document.querySelector('.bond_text__coupons');
const showAllCouponsButton = document.querySelector('.show-all-coupons');

const isin = 'RU000A1013N6';
const api_url = `https://iss.moex.com/iss/securities/${isin}/bondization.json?iss.json=extended&iss.meta=off&iss.only=coug=ru&limit=unlimited`;

const today = new Date();
let visible_old_coupons = 3;
let visible_feauters_coupons = 8;


function dateToRus(date) {
  return new Date(Date.parse(date)).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function newCouponCalendar(item) {
  const calendar = document.createElement('tr');
  calendar.classList.add('coupone-table__item');
  calendar.innerHTML = `
      <th>${dateToRus(item.coupondate)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  return calendar;
}

function oldCouponCalendar(item) {
  const calendar = document.createElement('tr');
  calendar.classList.add('coupone-table__item');
  calendar.classList.add('old-coupones');
  calendar.innerHTML = `
      <th>${dateToRus(item.coupondate)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  return calendar;
}

function currentCouponCalendar(item) {
  const calendar = document.createElement('tr');
  calendar.classList.add('coupone-table__item');
  calendar.classList.add('current-coupone');
  calendar.innerHTML = `
      <th>${dateToRus(item.coupondate)}</br><span class="current_coupon_span">Ближайшая выплата<span></th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
      
	`;

  return calendar;
}


function renderCalendar(oldCoupons, newCoupons) {
  oldCoupons.forEach((el) => {
    tableBody.append(oldCouponCalendar(el));
  });

  const currentCoupon = newCoupons[0];
  tableBody.append(currentCouponCalendar(currentCoupon));

  for (let i = 1; i < newCoupons.length; i++) {
    tableBody.append(newCouponCalendar(newCoupons[i]));
  }
}

function removeWidget() {
  calendarWindget.remove();
}


fetch(api_url)
  .then(r => r.json())
  .then((data) => {
    const coupons = data[1].coupons;
    const bondName = coupons[0].name

    bondTitle.textContent = bondName;
    console.log(coupons)
    //Кол-во купонов у облигации
    const allCoupones = coupons.length;

    const oldCoupons = [];
    const featureCoupons = [];

    coupons.forEach((el) => {
      const date = new Date(el.coupondate);
      if (date < today) {
        oldCoupons.push(el);
      } else {
        featureCoupons.push(el);
      }
    })

    // Кол-во выплаченных купонов
    const paysCoupons = oldCoupons.length;
    
    const filteredOLdCoupons = oldCoupons.slice(-visible_old_coupons);
    const filteredFeautersCoupons = featureCoupons.slice(0, visible_feauters_coupons);

    renderCalendar(filteredOLdCoupons, filteredFeautersCoupons);
    
    bondTextCoupons.innerHTML = `Выплачено купонов: <span>${paysCoupons}</span> из <span>${allCoupones}</span>`;

    showAllCouponsButton.addEventListener('click', () => {
      tableBody.innerHTML = '';
      renderCalendar(oldCoupons, featureCoupons);

      showAllCouponsButton.remove();
    })
  })
  .catch(() => {
    removeWidget();
  })
  ;
