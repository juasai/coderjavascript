// Base de datos de items para tanques
const itemsTanque = [
    {
        nombre: "Cursed Helmet",
        imagen: "../assets/cursed_helmet.jpg",
        hp: 1200,
        armadura: 0,
        resMagica: 25,
        precio: 1760,
        efecto: "Quema enemigos cercanos (1.5% HP enemigo como daño mágico por segundo)"
    },
    {
        nombre: "Athena's Shield",
        imagen: "../assets/athenea_shield.jpg",
        hp: 900,
        armadura: 0,
        resMagica: 62,
        precio: 2150,
        efecto: "Escudo mágico que absorbe daño (se recarga después de no recibir daño por 5s)"
    },
    {
        nombre: "Antique Cuirass",
        imagen: "../assets/antique_cuirass.jpg",
        hp: 1220,
        armadura: 54,
        resMagica: 0,
        precio: 2170,
        efecto: "Reduce el daño físico recibido de ataques repetidos del mismo enemigo"
    },
    {
        nombre: "Blade Armor",
        imagen: "../assets/blade_armon.jpg",
        hp: 0,
        armadura: 90,
        resMagica: 0,
        precio: 1660,
        efecto: "Refleja el 25% del daño físico recibido de ataques básicos"
    },
    {
        nombre: "Dominance Ice",
        imagen: "../assets/dominance_ice.jpg",
        hp: 700,
        armadura: 70,
        resMagica: 0,
        precio: 2010,
        efecto: "Reduce la velocidad de ataque y regeneración de HP de enemigos cercanos"
    },
    {
        nombre: "Immortality",
        imagen: "../assets/immortality.jpg",
        hp: 800,
        armadura: 40,
        resMagica: 0,
        precio: 2120,
        efecto: "Revive con 15% HP después de morir (enfriamiento 180s)"
    },
    {
        nombre: "Brute Force Breastplate",
        imagen: "../assets/brute_force_breastplate.jpg",
        hp: 770,
        armadura: 45,
        resMagica: 45,
        precio: 1870,
        efecto: "Aumenta movilidad y resistencia después de usar habilidades"
    }
];

// Variables globales inicializadas desde LocalStorage
let equipamiento = JSON.parse(localStorage.getItem('equipamiento')) || [];
let totalHP = parseInt(localStorage.getItem('totalHP')) || 0;
let totalArmadura = parseInt(localStorage.getItem('totalArmadura')) || 0;
let totalResMagica = parseInt(localStorage.getItem('totalResMagica')) || 0;
let precioTotal = parseInt(localStorage.getItem('precioTotal')) || 0;
let efectosUnicos = JSON.parse(localStorage.getItem('efectosUnicos')) || [];

// Elementos del DOM
const totalHPElement = document.getElementById('totalHP');
const totalArmaduraElement = document.getElementById('totalArmadura');
const totalResMagicaElement = document.getElementById('totalResMagica');
const precioTotalElement = document.getElementById('precioTotal');
const equipamientoCountElement = document.getElementById('equipamientoCount');
const equipmentListElement = document.getElementById('equipmentList');
const effectsListElement = document.getElementById('effectsList');
const itemListElement = document.getElementById('itemList');
const currentEquipmentDetailsElement = document.getElementById('currentEquipmentDetails');
const addItemBtn = document.getElementById('addItemBtn');
const viewEquipmentBtn = document.getElementById('viewEquipmentBtn');
const resetBtn = document.getElementById('resetBtn');
const addItemTab = document.getElementById('addItemTab');
const viewEquipmentTab = document.getElementById('viewEquipmentTab');
const notificationElement = document.getElementById('notification');

// Función para mostrar notificación
function showNotification(message, isSuccess = true) {
    notificationElement.textContent = message;
    notificationElement.style.backgroundColor = isSuccess ? '#2ecc71' : '#e74c3c';
    notificationElement.style.display = 'block';

    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 3000);
}

// Función para guardar el estado en LocalStorage
function guardarEstado() {
    localStorage.setItem('equipamiento', JSON.stringify(equipamiento));
    localStorage.setItem('totalHP', totalHP.toString());
    localStorage.setItem('totalArmadura', totalArmadura.toString());
    localStorage.setItem('totalResMagica', totalResMagica.toString());
    localStorage.setItem('precioTotal', precioTotal.toString());
    localStorage.setItem('efectosUnicos', JSON.stringify(efectosUnicos));
}

// Función para cargar el estado desde LocalStorage
function cargarEstado() {
    const equipamientoGuardado = localStorage.getItem('equipamiento');
    if (equipamientoGuardado) {
        equipamiento = JSON.parse(equipamientoGuardado);
    }

    totalHP = parseInt(localStorage.getItem('totalHP')) || 0;
    totalArmadura = parseInt(localStorage.getItem('totalArmadura')) || 0;
    totalResMagica = parseInt(localStorage.getItem('totalResMagica')) || 0;
    precioTotal = parseInt(localStorage.getItem('precioTotal')) || 0;

    const efectosGuardados = localStorage.getItem('efectosUnicos');
    if (efectosGuardados) {
        efectosUnicos = JSON.parse(efectosGuardados);
    }
}

// Función para actualizar las estadísticas en la UI
function actualizarEstadisticasUI() {
    totalHPElement.textContent = totalHP;
    totalArmaduraElement.textContent = totalArmadura;
    totalResMagicaElement.textContent = totalResMagica;
    precioTotalElement.textContent = `${precioTotal} oro`;
    equipamientoCountElement.textContent = equipamiento.length;
}

// Función para actualizar estadísticas y guardar estado
function actualizarEstadisticas(item, operacion) {
    const factor = operacion === 'sumar' ? 1 : -1;
    totalHP += item.hp * factor;
    totalArmadura += item.armadura * factor;
    totalResMagica += item.resMagica * factor;
    precioTotal += item.precio * factor;

    guardarEstado();
    actualizarEstadisticasUI();
}

// Función para actualizar la lista de efectos únicos
function actualizarEfectosUnicosUI() {
    effectsListElement.innerHTML = '';
    if (efectosUnicos.length === 0) {
        effectsListElement.innerHTML = '<li>No hay efectos únicos activos</li>';
        return;
    }

    efectosUnicos.forEach(efecto => {
        const li = document.createElement('li');
        li.textContent = `${efecto}`;
        effectsListElement.appendChild(li);
    });
}

// Función para actualizar la lista de equipamiento
function actualizarEquipamientoUI() {
    equipmentListElement.innerHTML = '';
    if (equipamiento.length === 0) {
        equipmentListElement.innerHTML = '<li>No hay items equipados</li>';
        return;
    }

    equipamiento.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'equipment-item';

        const itemContainer = document.createElement('div');
        itemContainer.style.display = 'flex';
        itemContainer.style.alignItems = 'center';
        itemContainer.style.flex = '1';

        const itemImage = document.createElement('img');
        itemImage.className = 'equipment-image';
        itemImage.src = item.imagen;
        itemImage.alt = item.nombre;

        const itemInfo = document.createElement('div');
        itemInfo.className = 'equipment-info';
        itemInfo.textContent = item.nombre;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Eliminar';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarItem(index);
        });

        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemInfo);
        li.appendChild(itemContainer);
        li.appendChild(removeBtn);
        equipmentListElement.appendChild(li);
    });
}

// Función para mostrar los items disponibles
function mostrarItemsDisponibles() {
    itemListElement.innerHTML = '';

    itemsTanque.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.addEventListener('click', () => agregarItem(index));

        const itemImage = document.createElement('img');
        itemImage.className = 'item-image';
        itemImage.src = item.imagen;
        itemImage.alt = item.nombre;

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.nombre;

        const itemStats = document.createElement('div');
        itemStats.className = 'item-stats';
        itemStats.textContent = `HP: ${item.hp} | Armadura: ${item.armadura} | Resistencia Mágica: ${item.resMagica} | Precio: ${item.precio}`;

        const itemEffect = document.createElement('div');
        itemEffect.className = 'item-effect';
        itemEffect.textContent = `Efecto: ${item.efecto}`;

        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemStats);
        itemInfo.appendChild(itemEffect);

        itemCard.appendChild(itemImage);
        itemCard.appendChild(itemInfo);
        itemListElement.appendChild(itemCard);
    });
}

// Función para mostrar el equipamiento actual con detalles
function mostrarEquipamientoDetallado() {
    currentEquipmentDetailsElement.innerHTML = '';

    if (equipamiento.length === 0) {
        currentEquipmentDetailsElement.innerHTML = '<p>No hay items en el equipamiento.</p>';
        return;
    }

    equipamiento.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-card';
        itemDiv.style.display = 'flex';

        const itemImage = document.createElement('img');
        itemImage.className = 'item-image';
        itemImage.src = item.imagen;
        itemImage.alt = item.nombre;

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.nombre;

        const itemStats = document.createElement('div');
        itemStats.className = 'item-stats';
        itemStats.textContent = `HP: ${item.hp} | Armadura: ${item.armadura} | Resistencia Mágica: ${item.resMagica} | Precio: ${item.precio}`;

        const itemEffect = document.createElement('div');
        itemEffect.className = 'item-effect';
        itemEffect.textContent = `Efecto: ${item.efecto}`;

        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemStats);
        itemInfo.appendChild(itemEffect);

        itemDiv.appendChild(itemImage);
        itemDiv.appendChild(itemInfo);
        currentEquipmentDetailsElement.appendChild(itemDiv);
    });
}

// Función para agregar un item al equipamiento
function agregarItem(index) {
    if (equipamiento.length >= 5) {
        showNotification("¡Máximo de 5 items alcanzado!", false);
        return;
    }

    const item = itemsTanque[index];
    equipamiento.push(item);
    actualizarEstadisticas(item, 'sumar');
    efectosUnicos.push(`${item.nombre}: ${item.efecto}`);

    actualizarEquipamientoUI();
    actualizarEstadisticasUI();
    actualizarEfectosUnicosUI();

    showNotification(`¡${item.nombre} agregado!`);
    guardarEstado();
}

// Función para eliminar un item del equipamiento
function eliminarItem(index) {
    const itemEliminado = equipamiento.splice(index, 1)[0];
    efectosUnicos = efectosUnicos.filter(efecto => !efecto.startsWith(itemEliminado.nombre));

    actualizarEstadisticas(itemEliminado, 'restar');
    actualizarEquipamientoUI();
    actualizarEfectosUnicosUI();

    showNotification(`¡${itemEliminado.nombre} eliminado!`);
    guardarEstado();
}

// Función para reiniciar el equipamiento
function reiniciarEquipamiento() {
    equipamiento = [];
    totalHP = 0;
    totalArmadura = 0;
    totalResMagica = 0;
    precioTotal = 0;
    efectosUnicos = [];

    actualizarEquipamientoUI();
    actualizarEstadisticasUI();
    actualizarEfectosUnicosUI();

    // Limpiar LocalStorage
    localStorage.removeItem('equipamiento');
    localStorage.removeItem('totalHP');
    localStorage.removeItem('totalArmadura');
    localStorage.removeItem('totalResMagica');
    localStorage.removeItem('precioTotal');
    localStorage.removeItem('efectosUnicos');

    showNotification("Equipamiento reiniciado.");
}

// Event Listeners
addItemBtn.addEventListener('click', () => {
    addItemTab.classList.add('active');
    viewEquipmentTab.classList.remove('active');
    addItemBtn.classList.add('active-tab');
    viewEquipmentBtn.classList.remove('active-tab');
    mostrarItemsDisponibles();
});

viewEquipmentBtn.addEventListener('click', () => {
    viewEquipmentTab.classList.add('active');
    addItemTab.classList.remove('active');
    viewEquipmentBtn.classList.add('active-tab');
    addItemBtn.classList.remove('active-tab');
    mostrarEquipamientoDetallado();
});

resetBtn.addEventListener('click', reiniciarEquipamiento);

// Inicialización
function init() {
    cargarEstado();
    actualizarEstadisticasUI();
    actualizarEquipamientoUI();
    actualizarEfectosUnicosUI();
    mostrarItemsDisponibles();
    mostrarEquipamientoDetallado();
}

// Iniciar la aplicación
init();
