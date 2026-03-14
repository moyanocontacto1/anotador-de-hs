document.addEventListener('DOMContentLoaded', function() {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const workDays = [2, 3, 4, 5, 6, 0]; // Martes=2, Miércoles=3, Jueves=4, Viernes=5, Sábado=6, Domingo=0

    const dayNameEl = document.getElementById('day-name');
    const entryTime1El = document.getElementById('entry-time-1');
    const exitTime1El = document.getElementById('exit-time-1');
    const markExit1Btn = document.getElementById('mark-exit-1');
    const editExit1Btn = document.getElementById('edit-exit-1');
    const hoursWorked1El = document.getElementById('hours-worked-1');
    const entryTime2El = document.getElementById('entry-time-2');
    const exitTime2El = document.getElementById('exit-time-2');
    const markExit2Btn = document.getElementById('mark-exit-2');
    const editExit2Btn = document.getElementById('edit-exit-2');
    const hoursWorked2El = document.getElementById('hours-worked-2');
    const totalDayEl = document.getElementById('total-day');
    const summaryBody = document.getElementById('summary-body');
    const totalHoursEl = document.getElementById('total-hours');

    function getCurrentDate() {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    function getWeekDates() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajuste para obtener el lunes
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDates.push(date.toISOString().split('T')[0]);
        }
        return weekDates;
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem('workHours') || '{}');
        return data;
    }

    function saveData(data) {
        localStorage.setItem('workHours', JSON.stringify(data));
    }

    function calculateHours(entry, exit) {
        const [entryH, entryM] = entry.split(':').map(Number);
        const [exitH, exitM] = exit.split(':').map(Number);
        const entryMinutes = entryH * 60 + entryM;
        let exitMinutes = exitH * 60 + exitM;

        // Si la hora de salida es menor que la de entrada, asumimos que es el día siguiente.
        if (exitMinutes < entryMinutes) {
            exitMinutes += 24 * 60;
        }

        const diffMinutes = exitMinutes - entryMinutes;
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        const decimal = (diffMinutes / 60).toFixed(2);
        const formatted = `${hours} horas y ${minutes} minutos`;
        return { decimal: parseFloat(decimal), formatted };
    }

    function validateTime(time) {
        const regex = /^\d{2}:\d{2}$/;
        if (!regex.test(time)) return false;
        const [h, m] = time.split(':').map(Number);
        return h >= 0 && h <= 23 && m >= 0 && m <= 59;
    }

    function updateCurrentDay() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentDate = getCurrentDate();
        const data = loadData();

        dayNameEl.textContent = days[dayOfWeek];

        if (workDays.includes(dayOfWeek)) {
            entryTime1El.textContent = '12:00';
            entryTime2El.textContent = '20:00';
            let totalDecimal = 0;

            // Turno 1
            if (data[currentDate] && data[currentDate].exit1) {
                exitTime1El.textContent = data[currentDate].exit1;
                const calc1 = calculateHours('12:00', data[currentDate].exit1);
                hoursWorked1El.textContent = calc1.formatted;
                totalDecimal += calc1.decimal;
                markExit1Btn.disabled = true;
                editExit1Btn.style.display = 'inline-block';
            } else {
                exitTime1El.textContent = '--:--';
                hoursWorked1El.textContent = '0 horas y 0 minutos';
                markExit1Btn.disabled = false;
                editExit1Btn.style.display = 'none';
            }

            // Turno 2
            if (data[currentDate] && data[currentDate].exit2) {
                exitTime2El.textContent = data[currentDate].exit2;
                const calc2 = calculateHours('20:00', data[currentDate].exit2);
                hoursWorked2El.textContent = calc2.formatted;
                totalDecimal += calc2.decimal;
                markExit2Btn.disabled = true;
                editExit2Btn.style.display = 'inline-block';
            } else {
                exitTime2El.textContent = '--:--';
                hoursWorked2El.textContent = '0 horas y 0 minutos';
                markExit2Btn.disabled = false;
                editExit2Btn.style.display = 'none';
            }

            const totalHours = Math.floor(totalDecimal);
            const totalMinutes = Math.round((totalDecimal - totalHours) * 60);
            totalDayEl.textContent = `${totalHours} horas y ${totalMinutes} minutos`;
        } else {
            entryTime1El.textContent = 'No laboral';
            exitTime1El.textContent = '--:--';
            hoursWorked1El.textContent = '0 horas y 0 minutos';
            markExit1Btn.disabled = true;
            editExit1Btn.style.display = 'none';
            entryTime2El.textContent = 'No laboral';
            exitTime2El.textContent = '--:--';
            hoursWorked2El.textContent = '0 horas y 0 minutos';
            markExit2Btn.disabled = true;
            editExit2Btn.style.display = 'none';
            totalDayEl.textContent = '0 horas y 0 minutos';
        }
    }

    function updateSummary() {
        const weekDates = getWeekDates();
        const data = loadData();
        summaryBody.innerHTML = '';
        let totalDecimal = 0;

        weekDates.forEach(date => {
            const dayOfWeek = new Date(date).getDay();
            const dayName = days[dayOfWeek];
            const displayDate = new Date(date).toLocaleDateString('es-ES', {day: 'numeric', month: 'long'});
            const entry1 = workDays.includes(dayOfWeek) ? '12:00' : '--:--';
            const exit1 = data[date] && data[date].exit1 ? data[date].exit1 : '--:--';
            let hours1 = '0 horas y 0 minutos';
            let decimal1 = 0;
            if (entry1 !== '--:--' && exit1 !== '--:--') {
                const calc1 = calculateHours('12:00', exit1);
                hours1 = calc1.formatted;
                decimal1 = calc1.decimal;
            }

            const entry2 = workDays.includes(dayOfWeek) ? '20:00' : '--:--';
            const exit2 = data[date] && data[date].exit2 ? data[date].exit2 : '--:--';
            let hours2 = '0 horas y 0 minutos';
            let decimal2 = 0;
            if (entry2 !== '--:--' && exit2 !== '--:--') {
                const calc2 = calculateHours('20:00', exit2);
                hours2 = calc2.formatted;
                decimal2 = calc2.decimal;
            }

            const dayTotalDecimal = decimal1 + decimal2;
            const dayTotalHours = Math.floor(dayTotalDecimal);
            const dayTotalMinutes = Math.round((dayTotalDecimal - dayTotalHours) * 60);
            const dayTotal = `${dayTotalHours} horas y ${dayTotalMinutes} minutos`;
            totalDecimal += dayTotalDecimal;

            const actions = (exit1 !== '--:--' || exit2 !== '--:--') ? `<button class="edit-btn" data-date="${date}">Editar</button> <button class="delete-btn" data-date="${date}">Eliminar</button>` : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dayName} (${displayDate})</td>
                <td>${entry1}</td>
                <td>${exit1}</td>
                <td>${hours1}</td>
                <td>${entry2}</td>
                <td>${exit2}</td>
                <td>${hours2}</td>
                <td>${dayTotal}</td>
                <td>${actions}</td>
            `;
            summaryBody.appendChild(row);
        });

        const totalHours = Math.floor(totalDecimal);
        const totalMinutes = Math.round((totalDecimal - totalHours) * 60);
        totalHoursEl.textContent = `${totalHours} horas y ${totalMinutes} minutos`;
    }

    markExit1Btn.addEventListener('click', function() {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        const currentDate = getCurrentDate();
        const data = loadData();
        if (!data[currentDate]) data[currentDate] = {};
        data[currentDate].exit1 = currentTime;
        saveData(data);
        updateCurrentDay();
        updateSummary();
    });

    editExit1Btn.addEventListener('click', function() {
        const currentDate = getCurrentDate();
        const data = loadData();
        const currentExit = data[currentDate] ? data[currentDate].exit1 : '';
        const newExit = prompt('Nueva hora de  salida Turno 1 (HH:MM):', currentExit);
        if (newExit && validateTime(newExit)) {
            if (!data[currentDate]) data[currentDate] = {};
            data[currentDate].exit1 = newExit;
            saveData(data);
            updateCurrentDay();
            updateSummary();
        } else if (newExit !== null) {
            alert('Formato inválido. Usa HH:MM.');
        }
    });

    markExit2Btn.addEventListener('click', function() {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        const currentDate = getCurrentDate();
        const data = loadData();
        if (!data[currentDate]) data[currentDate] = {};
        data[currentDate].exit2 = currentTime;
        saveData(data);
        updateCurrentDay();
        updateSummary();
    });

    editExit2Btn.addEventListener('click', function() {
        const currentDate = getCurrentDate();
        const data = loadData();
        const currentExit = data[currentDate] ? data[currentDate].exit2 : '';
        const newExit = prompt('Nueva hora de salida Turno 2:(HH:MM):', currentExit);
        if (newExit && validateTime(newExit)) {
            if (!data[currentDate]) data[currentDate] = {};
            data[currentDate].exit2 = newExit;
            saveData(data);
            updateCurrentDay();
            updateSummary();
        } else if (newExit !== null) {
            alert('Formato inválido. Usa HH:MM.');
        }
    });

    summaryBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const date = e.target.dataset.date;
            const turno = prompt('¿Qué turno deseas editar? (1: Turno 1, 2: Turno 2)', '');
            const data = loadData();
            if (turno === '1') {
                const currentExit = data[date] ? data[date].exit1 : '';
                const newExit = prompt('Nueva hora de salida Turno 1 (HH:MM):', currentExit);
                if (newExit && validateTime(newExit)) {
                    if (!data[date]) data[date] = {};
                    data[date].exit1 = newExit;
                } else if (newExit !== null) {
                    alert('Formato inválido.');
                    return;
                }
            } else if (turno === '2') {
                const currentExit = data[date] ? data[date].exit2 : '';
                const newExit = prompt('Nueva hora de salida Turno 2 (HH:MM):', currentExit);
                if (newExit && validateTime(newExit)) {
                    if (!data[date]) data[date] = {};
                    data[date].exit2 = newExit;
                } else if (newExit !== null) {
                    alert('Formato inválido.');
                    return;
                }
            } else {
                alert('Opción inválida.');
                return;
            }
            saveData(data);
            updateCurrentDay();
            updateSummary();
        }
        if (e.target.classList.contains('delete-btn')) {
            const date = e.target.dataset.date;
            const choice = prompt('¿Qué deseas eliminar? (1: Turno 1, 2: Turno 2, d: Día completo)', '');
            const data = loadData();
            let itemToDelete = '';
            let action = () => {};
            if (choice === '1') {
                itemToDelete = 'el Turno 1';
                action = () => { if (data[date]) delete data[date].exit1; };
            } else if (choice === '2') {
                itemToDelete = 'el Turno 2';
                action = () => { if (data[date]) delete data[date].exit2; };
            } else if (choice === 'd') {
                itemToDelete = 'el día completo';
                action = () => { delete data[date]; };
            } else {
                alert('Opción inválida.');
                return;
            }
            if (!confirm('¿Estás seguro de que quieres eliminar ' + itemToDelete + '?')) {
                return;
            }
            action();
            saveData(data);
            updateCurrentDay();
            updateSummary();
        }
    });

    updateCurrentDay();
    updateSummary();
});