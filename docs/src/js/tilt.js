document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.skill-container');

    cards.forEach(card => {
        card.addEventListener('mousemove', tiltCard);
        card.addEventListener('mouseleave', resetTilt);
    });

    function tiltCard(e) {
        const card = this;
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        const centerX = cardRect.left + cardWidth / 2;
        const centerY = cardRect.top + cardHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const rotateX = (mouseY / (cardHeight / 2)) * 10;
        const rotateY = -(mouseX / (cardWidth / 2)) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        const skillList = card.querySelector('.skill-middle-container');
        if (skillList) {
            const skillListRect = skillList.getBoundingClientRect();
            const skillListCenterY = skillListRect.top + skillListRect.height / 2 - cardRect.top;
            const skillListOffsetY = (skillListCenterY / (cardHeight / 2)) * 5;
            
            skillList.style.transform = `translateZ(20px) scale(1.05) rotateX(${-rotateX + skillListOffsetY}deg) rotateY(${-rotateY}deg)`;
        }
    }

    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        
        const skillList = this.querySelector('.skill-middle-container');
        if (skillList) {
            skillList.style.transform = 'translateZ(0) scale(1)';
        }
    }
});