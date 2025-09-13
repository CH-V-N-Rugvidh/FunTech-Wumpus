import { Question } from '../types';

export const techQuestions: Question[] = [
  // Rewritten and new questions (medium to hard)
  {
    id: 1,
    question: "What is the primary function of a blockchain consensus algorithm?",
    options: ["Encrypt data", "Validate transactions", "Store files", "Manage users"],
    correctAnswer: 1,
    category: 'emerging-tech',
    difficulty: 'medium',
    explanation: "Consensus algorithms ensure all nodes in a blockchain network agree on the validity of transactions."
  },
  {
    id: 2,
    question: "Which protocol is commonly used for secure file transfer over the internet?",
    options: ["FTP", "SFTP", "SMTP", "HTTP"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "SFTP (SSH File Transfer Protocol) provides secure file transfer capabilities over SSH."
  },
  {
    id: 3,
    question: "What is the main advantage of quantum computing over classical computing?",
    options: ["Lower power consumption", "Parallel processing of complex problems", "Cheaper hardware", "Better graphics"],
    correctAnswer: 1,
    category: 'emerging-tech',
    difficulty: 'hard',
    explanation: "Quantum computers can process certain complex problems exponentially faster through quantum parallelism."
  },
  {
    id: 4,
    question: "Which company rebranded itself as Meta to focus on the Metaverse?",
    options: ["Google", "Facebook", "Apple", "Microsoft"],
    correctAnswer: 1,
    category: 'emerging-tech',
    difficulty: 'medium',
    explanation: "Facebook rebranded to Meta in 2021 to reflect its focus on building the metaverse."
  },
  {
    id: 5,
    question: "What does NFT stand for in the context of digital assets?",
    options: ["Non-Fungible Token", "Network File Transfer", "New File Type", "Next Future Technology"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium',
    explanation: "NFTs are unique digital tokens that represent ownership of digital or physical assets."
  },
  {
    id: 6,
    question: "Which quantum principle allows qubits to be in multiple states at once?",
    options: ["Entanglement", "Superposition", "Decoherence", "Tunneling"],
    correctAnswer: 1,
    category: 'emerging-tech',
    difficulty: 'hard',
    explanation: "Superposition allows quantum bits to exist in multiple states simultaneously until measured."
  },
  {
    id: 7,
    question: "What is the main benefit of 5G networks for IoT devices?",
    options: ["Lower cost", "Reduced latency", "Better graphics", "More storage"],
    correctAnswer: 1,
    category: 'emerging-tech',
    difficulty: 'medium',
    explanation: "5G provides ultra-low latency, enabling real-time communication for IoT applications."
  },
  {
    id: 8,
    question: "Which sensor technology is crucial for autonomous vehicle navigation?",
    options: ["LIDAR", "Blockchain", "GPS", "WiFi"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium',
    explanation: "LIDAR uses laser pulses to create detailed 3D maps of the vehicle's surroundings."
  },
  {
    id: 9,
    question: "What does AR stand for in the context of technology?",
    options: ["Augmented Reality", "Artificial Reality", "Automated Response", "Advanced Rendering"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium',
    explanation: "Augmented Reality overlays digital information onto the real world through devices like smartphones or AR glasses."
  },
  {
    id: 10,
    question: "Which technology underpins smart contracts?",
    options: ["Blockchain", "AI", "Cloud Computing", "Big Data"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium',
    explanation: "Smart contracts are self-executing contracts with terms directly written into blockchain code."
  },
  {
    id: 11,
    question: "Who is credited with founding theoretical computer science?",
    options: ["Alan Turing", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "Alan Turing laid the theoretical foundations of computer science and artificial intelligence."
  },
  {
    id: 12,
    question: "What does CPU stand for in computing?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Computer Processing Unit"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "The CPU is the primary component that executes instructions in a computer system."
  },
  {
    id: 13,
    question: "Which programming language was created by Google for system programming?",
    options: ["Go", "Python", "Java", "Ruby"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "Go (Golang) was developed by Google for efficient system programming and concurrent applications."
  },
  {
    id: 14,
    question: "What does HTTP stand for in web technology?",
    options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transport Protocol", "High Text Transfer Protocol"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "HTTP is the foundation protocol for data communication on the World Wide Web."
  },
  {
    id: 15,
    question: "Which company developed the Android OS?",
    options: ["Google", "Apple", "Microsoft", "Samsung"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "Google acquired Android Inc. in 2005 and developed it into the world's most popular mobile OS."
  },
  {
    id: 16,
    question: "What does RAM stand for in computer hardware?",
    options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Real Access Memory"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "RAM provides temporary storage for data that the CPU needs quick access to."
  },
  {
    id: 17,
    question: "Which data structure follows the LIFO principle?",
    options: ["Stack", "Queue", "Array", "Tree"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "Stack follows Last In, First Out (LIFO) principle, like a stack of plates."
  },
  {
    id: 18,
    question: "What does API stand for in software development?",
    options: ["Application Programming Interface", "Advanced Programming Interface", "Application Program Integration", "Advanced Program Integration"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "APIs define how different software components should interact with each other."
  },
  {
    id: 19,
    question: "Which sorting algorithm has O(n log n) average-case complexity?",
    options: ["Merge Sort", "Bubble Sort", "Selection Sort", "Insertion Sort"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard',
    explanation: "Merge Sort consistently performs at O(n log n) time complexity in all cases."
  },
  {
    id: 20,
    question: "What does SQL stand for in databases?",
    options: ["Structured Query Language", "Simple Query Language", "System Query Language", "Standard Query Language"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "SQL is the standard language for managing and manipulating relational databases."
  },
  {
    id: 21,
    question: "Which company created the React library?",
    options: ["Facebook", "Google", "Microsoft", "Netflix"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "React was developed by Facebook (now Meta) for building user interfaces."
  },
  {
    id: 22,
    question: "What is the maximum value of an 8-bit unsigned integer?",
    options: ["255", "256", "127", "128"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "8 bits can represent 2^8 = 256 different values, from 0 to 255."
  },
  {
    id: 23,
    question: "Which protocol is used for secure web browsing?",
    options: ["HTTPS", "HTTP", "FTP", "SSH"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "HTTPS encrypts data between the browser and server using SSL/TLS protocols."
  },
  {
    id: 24,
    question: "What does CSS stand for in web design?",
    options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium',
    explanation: "CSS controls the presentation and styling of HTML documents."
  },
  {
    id: 25,
    question: "Which design pattern restricts a class to a single instance?",
    options: ["Singleton", "Observer", "Factory", "Strategy"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard',
    explanation: "The Singleton pattern ensures only one instance of a class exists throughout the application."
  },
  // 100 new questions (medium to hard)
  {
    id: 26,
    question: "Which protocol is used to send emails?",
    options: ["SMTP", "FTP", "HTTP", "SSH"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 27,
    question: "What is the main function of a DNS server?",
    options: ["Store files", "Translate domain names to IP addresses", "Encrypt data", "Manage databases"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 28,
    question: "Which sorting algorithm is NOT stable?",
    options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"],
    correctAnswer: 2,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 29,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 30,
    question: "Which of the following is a NoSQL database?",
    options: ["MySQL", "MongoDB", "PostgreSQL", "Oracle"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 31,
    question: "What does the acronym 'IoT' stand for?",
    options: ["Internet of Things", "Input Output Technology", "Integrated Online Tools", "Internal Operating Technique"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 32,
    question: "Which company developed the TensorFlow library?",
    options: ["Microsoft", "Google", "Amazon", "IBM"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 33,
    question: "Which of the following is a strongly typed language?",
    options: ["JavaScript", "Python", "TypeScript", "PHP"],
    correctAnswer: 2,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 34,
    question: "What is the main advantage of using Docker?",
    options: ["Faster graphics", "Containerization of applications", "Better battery life", "Improved RAM"],
    correctAnswer: 1,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 35,
    question: "Which algorithm is used for public key encryption?",
    options: ["AES", "RSA", "SHA-256", "MD5"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 36,
    question: "Which of the following is a front-end JavaScript framework?",
    options: ["Django", "React", "Flask", "Laravel"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 37,
    question: "Which technology is used for real-time communication in web apps?",
    options: ["WebSockets", "REST", "SOAP", "FTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 38,
    question: "Which data structure is used for implementing recursion?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 39,
    question: "Which protocol is used for remote login to servers?",
    options: ["SSH", "HTTP", "FTP", "SMTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 40,
    question: "Which sorting algorithm is best for nearly sorted arrays?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Quick Sort"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 41,
    question: "Which database is known for horizontal scalability?",
    options: ["MongoDB", "MySQL", "Oracle", "SQLite"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 42,
    question: "Which technology is used for container orchestration?",
    options: ["Kubernetes", "Docker", "Jenkins", "Ansible"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 43,
    question: "Which protocol is used for encrypted web traffic?",
    options: ["HTTPS", "HTTP", "FTP", "SMTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 44,
    question: "Which algorithm is used for shortest path in graphs?",
    options: ["Dijkstra's", "Prim's", "Kruskal's", "Bellman-Ford"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 45,
    question: "Which cloud provider offers Lambda serverless functions?",
    options: ["AWS", "Azure", "Google Cloud", "IBM Cloud"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 46,
    question: "Which data structure is used for BFS traversal?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 47,
    question: "Which protocol is used for transferring web pages?",
    options: ["HTTP", "FTP", "SMTP", "SSH"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 48,
    question: "Which algorithm is used for data compression?",
    options: ["Huffman Coding", "Dijkstra's", "Bubble Sort", "RSA"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 49,
    question: "Which technology is used for distributed version control?",
    options: ["Git", "SVN", "Mercurial", "CVS"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 50,
    question: "Which protocol is used for secure shell access?",
    options: ["SSH", "HTTP", "FTP", "SMTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 51,
    question: "Which protocol is used for sending encrypted emails?",
    options: ["SMTPS", "POP3", "IMAP", "FTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 52,
    question: "Which algorithm is used for symmetric encryption?",
    options: ["RSA", "AES", "SHA-1", "ECC"],
    correctAnswer: 1,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 53,
    question: "Which database system is best suited for storing time-series data?",
    options: ["InfluxDB", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 54,
    question: "Which technology is used for automating software deployment?",
    options: ["Jenkins", "Git", "Docker", "Kubernetes"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 55,
    question: "Which protocol is used for wireless local area networking?",
    options: ["WiFi", "Bluetooth", "Zigbee", "NFC"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 56,
    question: "Which algorithm is used for finding minimum spanning trees?",
    options: ["Prim's", "Dijkstra's", "Bellman-Ford", "A*"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 57,
    question: "Which technology is used for real-time data streaming?",
    options: ["Kafka", "MySQL", "Redis", "MongoDB"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 58,
    question: "Which protocol is used for network time synchronization?",
    options: ["NTP", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 59,
    question: "Which algorithm is used for lossless image compression?",
    options: ["LZW", "JPEG", "MP3", "H.264"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 60,
    question: "Which technology is used for managing container clusters?",
    options: ["Kubernetes", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 61,
    question: "Which protocol is used for secure web APIs?",
    options: ["HTTPS", "HTTP", "FTP", "SMTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 62,
    question: "Which algorithm is used for hash generation in blockchains?",
    options: ["SHA-256", "MD5", "AES", "RSA"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 63,
    question: "Which database is optimized for key-value storage?",
    options: ["Redis", "MySQL", "PostgreSQL", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 64,
    question: "Which protocol is used for instant messaging?",
    options: ["XMPP", "SMTP", "FTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 65,
    question: "Which algorithm is used for page ranking in search engines?",
    options: ["PageRank", "Bubble Sort", "Dijkstra's", "SHA-1"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 66,
    question: "Which technology is used for serverless computing?",
    options: ["AWS Lambda", "Docker", "Kubernetes", "Jenkins"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 67,
    question: "Which protocol is used for device discovery on local networks?",
    options: ["mDNS", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 68,
    question: "Which algorithm is used for clustering data?",
    options: ["K-means", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 69,
    question: "Which database is best for storing documents?",
    options: ["MongoDB", "MySQL", "Redis", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 70,
    question: "Which protocol is used for secure remote desktop access?",
    options: ["RDP", "SSH", "FTP", "SMTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 71,
    question: "Which algorithm is used for sorting large datasets externally?",
    options: ["External Merge Sort", "Bubble Sort", "Quick Sort", "Heap Sort"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 72,
    question: "Which technology is used for distributed computing?",
    options: ["Apache Hadoop", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 73,
    question: "Which protocol is used for secure wireless communication?",
    options: ["WPA2", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 74,
    question: "Which algorithm is used for face recognition?",
    options: ["Eigenfaces", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 75,
    question: "Which database is best for storing geospatial data?",
    options: ["PostGIS", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 76,
    question: "Which protocol is used for secure file transfer over SSH?",
    options: ["SCP", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 77,
    question: "Which algorithm is used for detecting anomalies in data?",
    options: ["Isolation Forest", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 78,
    question: "Which technology is used for edge computing?",
    options: ["Fog Computing", "Cloud Computing", "Docker", "Jenkins"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 79,
    question: "Which protocol is used for secure email retrieval?",
    options: ["IMAPS", "POP3", "SMTP", "FTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 80,
    question: "Which algorithm is used for recommendation systems?",
    options: ["Collaborative Filtering", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 81,
    question: "Which database is best for storing graph data?",
    options: ["Neo4j", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 82,
    question: "Which protocol is used for secure instant messaging?",
    options: ["Signal Protocol", "SMTP", "FTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 83,
    question: "Which algorithm is used for dimensionality reduction?",
    options: ["PCA", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 84,
    question: "Which technology is used for big data analytics?",
    options: ["Apache Spark", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 85,
    question: "Which protocol is used for secure network management?",
    options: ["SNMPv3", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 86,
    question: "Which algorithm is used for text classification?",
    options: ["Naive Bayes", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 87,
    question: "Which database is best for storing time-series sensor data?",
    options: ["InfluxDB", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 88,
    question: "Which protocol is used for secure wireless payments?",
    options: ["NFC", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 89,
    question: "Which algorithm is used for image segmentation?",
    options: ["Watershed", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 90,
    question: "Which technology is used for cloud-native applications?",
    options: ["Kubernetes", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 91,
    question: "Which protocol is used for secure web authentication?",
    options: ["OAuth2", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 92,
    question: "Which algorithm is used for speech recognition?",
    options: ["Hidden Markov Model", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 93,
    question: "Which database is best for storing unstructured data?",
    options: ["MongoDB", "MySQL", "Redis", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 94,
    question: "Which protocol is used for secure file sharing?",
    options: ["SFTP", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 95,
    question: "Which algorithm is used for fraud detection?",
    options: ["Random Forest", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 96,
    question: "Which technology is used for scalable microservices?",
    options: ["Kubernetes", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 97,
    question: "Which protocol is used for secure network tunneling?",
    options: ["VPN", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 98,
    question: "Which algorithm is used for object detection in images?",
    options: ["YOLO", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 99,
    question: "Which database is best for storing relational data?",
    options: ["MySQL", "MongoDB", "Redis", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 100,
    question: "Which protocol is used for secure web sockets?",
    options: ["WSS", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 101,
    question: "Which algorithm is used for video compression?",
    options: ["H.264", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 102,
    question: "Which technology is used for real-time analytics?",
    options: ["Apache Flink", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 103,
    question: "Which protocol is used for secure network access control?",
    options: ["802.1X", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 104,
    question: "Which algorithm is used for data deduplication?",
    options: ["Rabin Fingerprinting", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 105,
    question: "Which database is best for storing large-scale analytics data?",
    options: ["Google BigQuery", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 106,
    question: "Which protocol is used for secure network file system?",
    options: ["NFSv4", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 107,
    question: "Which algorithm is used for load balancing?",
    options: ["Round Robin", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 108,
    question: "Which technology is used for scalable cloud storage?",
    options: ["Amazon S3", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 109,
    question: "Which protocol is used for secure network monitoring?",
    options: ["NetFlow", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 110,
    question: "Which algorithm is used for distributed consensus?",
    options: ["Paxos", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 111,
    question: "Which database is best for storing columnar data?",
    options: ["Apache Cassandra", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 112,
    question: "Which protocol is used for secure network virtualization?",
    options: ["VXLAN", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 113,
    question: "Which algorithm is used for distributed file systems?",
    options: ["Consistent Hashing", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'hard'
  },
  {
    id: 114,
    question: "Which technology is used for scalable web hosting?",
    options: ["AWS Elastic Beanstalk", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 115,
    question: "Which protocol is used for secure network automation?",
    options: ["NETCONF", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 116,
    question: "Which algorithm is used for distributed caching?",
    options: ["LRU", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'medium'
  },
  {
    id: 117,
    question: "Which database is best for storing distributed ledgers?",
    options: ["Hyperledger Fabric", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 118,
    question: "Which protocol is used for secure network orchestration?",
    options: ["OpenFlow", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 119,
    question: "Which algorithm is used for distributed messaging?",
    options: ["Publish-Subscribe", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 120,
    question: "Which technology is used for scalable API gateways?",
    options: ["Kong", "Docker", "Jenkins", "Git"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 121,
    question: "Which protocol is used for secure network file transfer?",
    options: ["SFTP", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 122,
    question: "Which algorithm is used for distributed transaction management?",
    options: ["Two-Phase Commit", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 123,
    question: "Which database is best for storing distributed objects?",
    options: ["Couchbase", "MySQL", "MongoDB", "Oracle"],
    correctAnswer: 0,
    category: 'emerging-tech',
    difficulty: 'medium'
  },
  {
    id: 124,
    question: "Which protocol is used for secure network configuration?",
    options: ["NETCONF", "FTP", "SMTP", "HTTP"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  },
  {
    id: 125,
    question: "Which algorithm is used for distributed resource allocation?",
    options: ["Banker's Algorithm", "Bubble Sort", "Dijkstra's", "SHA-256"],
    correctAnswer: 0,
    category: 'general-tech',
    difficulty: 'hard'
  }
];

export function getRandomQuestion(excludeIds: number[] = [], customQuestions?: Question[]): Question {
  const questionPool = customQuestions && customQuestions.length > 0 ? customQuestions : techQuestions;
  
  // Get global asked questions from localStorage
  const globalAskedQuestions = JSON.parse(localStorage.getItem('global-asked-questions') || '[]');
  const allExcludeIds = [...new Set([...excludeIds, ...globalAskedQuestions])];
  const availableQuestions = questionPool.filter(q => !allExcludeIds.includes(q.id));
  
  // If all questions have been asked, reset and start over
  if (availableQuestions.length === 0) {
    localStorage.removeItem('global-asked-questions');
    // Only exclude current session questions after reset
    const resetAvailableQuestions = questionPool.filter(q => !excludeIds.includes(q.id));
    const selectedQuestion = resetAvailableQuestions.length > 0 
      ? resetAvailableQuestions[Math.floor(Math.random() * resetAvailableQuestions.length)]
      : questionPool[Math.floor(Math.random() * questionPool.length)];
    
    // Add to global asked questions
    localStorage.setItem('global-asked-questions', JSON.stringify([selectedQuestion.id]));
    return shuffleOptions(selectedQuestion);
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const question = { ...availableQuestions[randomIndex] };
  
  // Add to global asked questions
  const newGlobalAsked = [...globalAskedQuestions, question.id];
  localStorage.setItem('global-asked-questions', JSON.stringify(newGlobalAsked));
  
  return shuffleOptions(question);
}

function shuffleOptions(question: Question): Question {
  // Shuffle options
  const shuffledOptions = [...question.options];
  const correctOption = shuffledOptions[question.correctAnswer];
  
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  
  // Update correct answer index after shuffle
  question.options = shuffledOptions;
  question.correctAnswer = shuffledOptions.indexOf(correctOption);
  
  return question;
}