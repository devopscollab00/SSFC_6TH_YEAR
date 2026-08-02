// Living Tree of Faith Animation
class TreeAnimation {
  constructor() {
    this.svg = document.getElementById("treeSvg");
    this.confirmations = 0;
    this.stage = 0;
    this.maxConfirmations = 100;
    
    if (this.svg) {
      this.init();
      this.startAnimation();
    }
  }
  
  init() {
    // Fetch current confirmations from API
    this.updateFromAPI();
  }
  
  async updateFromAPI() {
    try {
      const response = await util.fetchAPI("GET_STATS", "POST", { action: "GET_STATS" });
      this.confirmations = response.peopleConfirmed || 0;
      this.updateTreeStage();
      this.drawTree();
    } catch (error) {
      console.log("Using default tree state");
      this.drawTree();
    }
  }
  
  updateTreeStage() {
    const percentage = (this.confirmations / this.maxConfirmations) * 100;
    if (percentage < 10) this.stage = 0;
    else if (percentage < 30) this.stage = 1;
    else if (percentage < 50) this.stage = 2;
    else if (percentage < 80) this.stage = 3;
    else this.stage = 4;
  }
  
  drawTree() {
    this.svg.innerHTML = "";
    
    const stages = [
      this.drawSeedling.bind(this),
      this.drawYoungTree.bind(this),
      this.drawGrowingTree.bind(this),
      this.drawBloomingTree.bind(this),
      this.drawFullBloom.bind(this),
    ];
    
    if (stages[this.stage]) {
      stages[this.stage]();
    }
  }
  
  drawSeedling() {
    // Trunk
    const trunk = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    trunk.setAttribute("x", "95");
    trunk.setAttribute("y", "200");
    trunk.setAttribute("width", "10");
    trunk.setAttribute("height", "80");
    trunk.setAttribute("fill", "#8b7355");
    trunk.setAttribute("class", "tree-part");
    this.svg.appendChild(trunk);
    
    // Seedling leaves
    const leaf = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    leaf.setAttribute("cx", "100");
    leaf.setAttribute("cy", "180");
    leaf.setAttribute("rx", "15");
    leaf.setAttribute("ry", "25");
    leaf.setAttribute("fill", "#90ee90");
    leaf.setAttribute("class", "tree-part");
    this.svg.appendChild(leaf);
  }
  
  drawYoungTree() {
    // Trunk
    const trunk = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    trunk.setAttribute("x", "90");
    trunk.setAttribute("y", "160");
    trunk.setAttribute("width", "20");
    trunk.setAttribute("height", "120");
    trunk.setAttribute("fill", "#8b7355");
    trunk.setAttribute("class", "tree-part");
    this.svg.appendChild(trunk);
    
    // Crown
    const crown = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    crown.setAttribute("cx", "100");
    crown.setAttribute("cy", "120");
    crown.setAttribute("rx", "35");
    crown.setAttribute("ry", "50");
    crown.setAttribute("fill", "#6b8e23");
    crown.setAttribute("class", "tree-part");
    this.svg.appendChild(crown);
  }
  
  drawGrowingTree() {
    // Trunk
    const trunk = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    trunk.setAttribute("x", "85");
    trunk.setAttribute("y", "140");
    trunk.setAttribute("width", "30");
    trunk.setAttribute("height", "140");
    trunk.setAttribute("fill", "#8b7355");
    trunk.setAttribute("class", "tree-part");
    this.svg.appendChild(trunk);
    
    // Main crown
    const crown = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    crown.setAttribute("cx", "100");
    crown.setAttribute("cy", "90");
    crown.setAttribute("r", "50");
    crown.setAttribute("fill", "#228b22");
    crown.setAttribute("class", "tree-part");
    this.svg.appendChild(crown);
    
    // Side branches
    const leftBranch = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    leftBranch.setAttribute("cx", "50");
    leftBranch.setAttribute("cy", "120");
    leftBranch.setAttribute("rx", "30");
    leftBranch.setAttribute("ry", "35");
    leftBranch.setAttribute("fill", "#228b22");
    leftBranch.setAttribute("class", "tree-part");
    this.svg.appendChild(leftBranch);
    
    const rightBranch = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    rightBranch.setAttribute("cx", "150");
    rightBranch.setAttribute("cy", "120");
    rightBranch.setAttribute("rx", "30");
    rightBranch.setAttribute("ry", "35");
    rightBranch.setAttribute("fill", "#228b22");
    rightBranch.setAttribute("class", "tree-part");
    this.svg.appendChild(rightBranch);
  }
  
  drawBloomingTree() {
    // Trunk
    const trunk = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    trunk.setAttribute("x", "85");
    trunk.setAttribute("y", "140");
    trunk.setAttribute("width", "30");
    trunk.setAttribute("height", "140");
    trunk.setAttribute("fill", "#8b7355");
    trunk.setAttribute("class", "tree-part");
    this.svg.appendChild(trunk);
    
    // Main crown
    const crown = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    crown.setAttribute("cx", "100");
    crown.setAttribute("cy", "70");
    crown.setAttribute("r", "60");
    crown.setAttribute("fill", "#228b22");
    crown.setAttribute("class", "tree-part");
    this.svg.appendChild(crown);
    
    // Side branches with flowers
    [-50, 150].forEach((cx) => {
      const branch = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      branch.setAttribute("cx", cx + 100);
      branch.setAttribute("cy", "110");
      branch.setAttribute("rx", "35");
      branch.setAttribute("ry", "40");
      branch.setAttribute("fill", "#228b22");
      branch.setAttribute("class", "tree-part");
      this.svg.appendChild(branch);
      
      // Flowers
      this.addFlowers(cx + 100, 100);
    });
    
    // Top flowers
    this.addFlowers(100, 30);
  }
  
  drawFullBloom() {
    // Trunk
    const trunk = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    trunk.setAttribute("x", "85");
    trunk.setAttribute("y", "150");
    trunk.setAttribute("width", "30");
    trunk.setAttribute("height", "130");
    trunk.setAttribute("fill", "#8b7355");
    trunk.setAttribute("class", "tree-part");
    this.svg.appendChild(trunk);
    
    // Main crown
    const crown = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    crown.setAttribute("cx", "100");
    crown.setAttribute("cy", "60");
    crown.setAttribute("r", "65");
    crown.setAttribute("fill", "#228b22");
    crown.setAttribute("class", "tree-part");
    this.svg.appendChild(crown);
    
    // Large side branches
    [-60, 160].forEach((cx) => {
      const branch = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      branch.setAttribute("cx", cx + 100);
      branch.setAttribute("cy", "100");
      branch.setAttribute("rx", "40");
      branch.setAttribute("ry", "45");
      branch.setAttribute("fill", "#228b22");
      branch.setAttribute("class", "tree-part");
      this.svg.appendChild(branch);
      
      this.addFlowers(cx + 100, 80);
    });
    
    // Multiple top flowers
    [100, 70, 130].forEach((cx) => {
      this.addFlowers(cx, cx === 100 ? 20 : 40);
    });
  }
  
  addFlowers(cx, cy, count = 3) {
    const colors = ["#ff69b4", "#ff1493", "#ffc0cb"];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * 15;
      const y = cy + Math.sin(angle) * 15;
      
      const flower = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      flower.setAttribute("cx", x);
      flower.setAttribute("cy", y);
      flower.setAttribute("r", "4");
      flower.setAttribute("fill", colors[i % colors.length]);
      flower.setAttribute("class", "tree-flower");
      this.svg.appendChild(flower);
    }
  }
  
  startAnimation() {
    setInterval(() => {
      this.updateFromAPI();
    }, 5000); // Update every 5 seconds
  }
}

// Initialize tree when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const tree = new TreeAnimation();
  window.treeAnimation = tree;
});
