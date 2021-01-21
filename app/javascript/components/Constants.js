export const translations = {
    month: 'Mês',
    day: 'Dia',
    week: 'Semana',
    today: 'Hoje',
    previous: '<',
    next: '>',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    showMore: function showMore(total) {
        return "+" + total + " eventos";
    }
}

export const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 101
    }
}

export const csrfToken = document.querySelector("[name='csrf-token']").content
