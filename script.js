const table = document.querySelector('.coupone-table');
const bondTitle = document.querySelector('.bond_title');


function dateToRus(date) {
  return new Date(Date.parse(date)).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

}

const today = new Date();

console.log(typeof(today))

function couponList(item, index) {
  const newElement = document.createElement('tr');
  const date = new Date(item.coupondate);
  newElement.classList.add('coupone-table__list');
  newElement.innerHTML = `
      <th>${index}</th>
      <th>${dateToRus(date)}</th>
      <th>${item.value_rub}₽</th>
      <th>${item.valueprc}%</th>
	`;

  if (date < today) {
    newElement.querySelectorAll('th').forEach((el) => {
      el.classList.add('old-coupones');
    });
  }

  
  
  return newElement;
}

function renderCalendar(data) {
  const coupones = data[1].coupons;
  console.log(coupones);
  coupones.forEach((element, i) => {
    let index = i + 1;
    bondTitle.textContent = element.name;
    table.append(couponList(element, index));
  });
}


fetch('https://iss.moex.com/iss/securities/RU000A102LF6/bondization.json?iss.json=extended&iss.meta=off&iss.only=coupons&lang=ru&limit=unlimited')
  .then(r => r.json())
  .then((data) => renderCalendar(data));


