// Clock

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById('clock').textContent = formattedTime;
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  // Draggable widgets
  function makeDraggable(el) {
    let offsetX, offsetY;
    el.onmousedown = function (e) {
      e.preventDefault();
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.onmousemove = function (e) {
        el.style.left = (e.clientX - offsetX) + "px";
        el.style.top = (e.clientY - offsetY) + "px";
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
  
  // Apply to all widgets
  window.onload = () => {
    ['time-widget', 'map-widget', 'notepad-widget','youtube-widget','calculator-widget','schedule-widget','weather-widget','stock-widget','spotify-widget','whatsapp-widget','football-widget'].forEach(id => {
      const el = document.getElementById(id);
      if (el) makeDraggable(el);
    });
  
    // Load notepad content
    const notepad = document.getElementById("notepad");
    if (notepad) {
      notepad.value = localStorage.getItem("jarvis-notes") || "";
      notepad.addEventListener("input", () => {
        localStorage.setItem("jarvis-notes", notepad.value);
      });
    }
  };
  function showSearchResult(answer, query) {
    const widget = document.getElementById("search-result-widget");
    const content = document.getElementById("search-result-content");
  
    content.innerHTML = `
      <p class="text-sm text-gray-400">Query: ${query}</p>
      <p class="text-lg font-bold text-white mt-2">${answer}</p>
    `;
  
    widget.classList.add("show");
  
    // Auto-hide after 10 seconds
    setTimeout(() => {
      widget.classList.remove("show");
    }, 10000);
  }

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === '=') {
      try {
        expression = eval(expression).toString();
      } catch {
        expression = 'Error';
      }
    } else if (value === 'C') {
      expression = '';
    } else {
      expression += value;
    }

    calcScreen.textContent = expression || '0';
  });
});

document.getElementById('add-widget-button').addEventListener('click', () => {
    const newWidget = document.createElement('div');
    newWidget.className = 'jarvis-widget orbitron';
    newWidget.style.top = `${100 + Math.random() * 400}px`;  // Random position
    newWidget.style.left = `${100 + Math.random() * 400}px`;
    newWidget.style.position = 'fixed';
  
    newWidget.innerHTML = `
      <div class="corner top-left"></div>
      <div class="corner top-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner bottom-right"></div>
      <div class="widget-header">Custom</div>
      <div class="widget-divider"></div>
      <textarea placeholder="New Widget Content..."></textarea>
    `;
  
    document.body.appendChild(newWidget);
  });
  const calc = document.getElementById("calculator-widget");
calc.style.width = "250px";
calc.style.height = "auto"; // or whatever fixed height you want

document.querySelectorAll('.widget').forEach(widget => {
    widget.addEventListener('contextmenu', function(event) {
        event.preventDefault();  // Prevent the default right-click menu
        widget.style.display = 'none';  // Hide the widget
    });
});
// Function to fetch weather data
async function getWeather() {
    const apiKey = "701601ec63c44e62acd54851251804"; // Replace with your WeatherAPI key
    const city = "Delhi"; // Replace with the city you want to fetch the weather for
  
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
      const data = await response.json();
  
      if (data.error) {
        document.getElementById('weather-info').innerHTML = "<p>Weather data not available.</p>";
      } else {
        const tempC = data.current.temp_c;
        const condition = data.current.condition.text;
        const iconUrl = data.current.condition.icon;
  
        // Update weather widget
        document.getElementById('weather-info').innerHTML = `
          <img src="https:${iconUrl}" alt="weather icon" />
          <p>${tempC}°C</p>
          <p>${condition}</p>
        `;
      }
    } catch (error) {
      document.getElementById('weather-info').innerHTML = "<p>Failed to fetch weather data.</p>";
    }
  }
  
  // Call getWeather function when the page loads
  window.onload = getWeather;
  // Stock Chart
  const ctx = document.getElementById('stockChart').getContext('2d');
  const stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],  // Labels
      datasets: [{
        label: 'Stock Value',
        data: [100, 120, 150, 170, 160, 190, 210],  // Static data
        borderColor: '#00bfff',
        backgroundColor: 'rgba(0, 191, 255, 0.1)',
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { display: false },
          ticks: { color: '#fff' }
        }
      }
    }
  });
  // Function to fetch football data (e.g., live scores or fixtures)
async function getFootballData() {
  const apiKey = "e6431ac3a6d94b5582d30775148f4510"; // Replace with your Football API key
  const leagueId = "2021"; // Replace with the ID for the league (e.g., Premier League)

  try {
    const response = await fetch(`https://api.football-data.org/v4/matches?competitions=${leagueId}`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': apiKey
      }
    });
    const data = await response.json();

    if (data.matches && data.matches.length > 0) {
      const match = data.matches[0]; // Get the first match (can be modified to show more)
      const homeTeam = match.homeTeam.name;
      const awayTeam = match.awayTeam.name;
      const score = match.score.fullTime;

      // Update football widget
      document.getElementById('match-info').innerHTML = `
        <p><strong>${homeTeam}</strong> vs <strong>${awayTeam}</strong></p>
        <p>Score: ${score.homeTeam} - ${score.awayTeam}</p>
        <p><small>Upcoming Match</small></p>
      `;
    } else {
      document.getElementById('match-info').innerHTML = "<p>No live matches available.</p>";
    }
  } catch (error) {
    document.getElementById('match-info').innerHTML = "<p>Failed to fetch football data.</p>";
  }
}

// Add event listener for the refresh button
document.getElementById('refresh-scores').addEventListener('click', () => {
  getFootballData();
});




window.addEventListener('load', () => {
  const globeContainer = document.getElementById('globeViz');
  if (globeContainer) {
    const myGlobe = Globe()
      (globeContainer)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .backgroundColor('rgba(0,0,0,0)')
      .width(globeContainer.offsetWidth)
      .height(globeContainer.offsetHeight)
      .autoRotate(true)
      .autoRotateSpeed(0.5);
  }
});
