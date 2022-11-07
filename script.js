const tableBody = document.querySelector('.coupone-table__body');
const bondTitle = document.querySelector('.bond_title');
const bondTextCoupons = document.querySelector('.bond_text__coupons');


function dateToRus(date) {
  return new Date(Date.parse(date)).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const today = new Date();


function newCouponCalendar(item) {
  const calendar = document.createElement('tr');
  const date = new Date(item.coupondate);
  calendar.classList.add('coupone-table__item');
  calendar.innerHTML = `
      <th>${dateToRus(date)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  return calendar;
}

function oldCouponCalendar(item) {
  const calendar = document.createElement('tr');
  const date = new Date(item.coupondate);
  calendar.classList.add('coupone-table__item');
  calendar.classList.add('old-coupones');
  calendar.innerHTML = `
      <th>${dateToRus(date)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  return calendar;
}

function currentCouponCalendar(item) {
  const calendar = document.createElement('tr');
  const date = new Date(item.coupondate);
  calendar.classList.add('coupone-table__item');
  calendar.classList.add('feature-coupones');
  calendar.innerHTML = `
      <th>${dateToRus(date)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  return calendar;
}

// function renderCalendar(data) {
//   const coupones = data[1].coupons;
//   console.log(coupones);
//   coupones.forEach((element, i) => {
//     let index = i + 1;
//     bondTitle.textContent = element.name;
//     tableBody.append(couponList(element));
//   });
// }



fetch('https://iss.moex.com/iss/securities/RU000A0ZZAT8/bondization.json?iss.json=extended&iss.meta=off&iss.only=coupons&lang=ru&limit=unlimited')
  .then(r => r.json())
  .then((data) => {
    let coupons = data[1].coupons;
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
    
    
    oldCoupons.forEach((el) => {
      tableBody.append(oldCouponCalendar(el));
    });

    const currentCoupon = featureCoupons[0];
    tableBody.append(currentCouponCalendar(currentCoupon));

    featureCoupons.forEach((el) => {
      tableBody.append(newCouponCalendar(el));
    });

    const paysCoupons = oldCoupons.length;


    bondTextCoupons.textContent = `Выплачено купонов: ${paysCoupons} из ${allCoupones}`;
  });


