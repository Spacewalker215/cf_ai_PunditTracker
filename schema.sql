DROP TABLE IF EXISTS Predictions;
DROP TABLE IF EXISTS Pundits;

CREATE TABLE Pundits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  category TEXT,
  totalPredictions INTEGER DEFAULT 0,
  correctPredictions INTEGER DEFAULT 0,
  accuracy REAL DEFAULT 0
);

CREATE TABLE Predictions (
  id TEXT PRIMARY KEY,
  punditId TEXT NOT NULL,
  statement TEXT NOT NULL,
  date TEXT NOT NULL,
  deadline TEXT,
  outcome TEXT DEFAULT 'Pending',
  confidence INTEGER,
  notes TEXT,
  FOREIGN KEY (punditId) REFERENCES Pundits(id)
);

-- Seed Data
INSERT INTO Pundits (id, name, bio, image, category, totalPredictions, correctPredictions, accuracy) VALUES 
('jim-cramer', 'Jim Cramer', 'Host of Mad Money on CNBC. Known for high-energy stock picks.', 'https://placehold.co/400x400/png?text=JC', 'Finance', 150, 72, 48),
('stephen-a-smith', 'Stephen A. Smith', 'Sports television personality, radio host, and journalist.', 'https://placehold.co/400x400/png?text=SAS', 'Sports', 200, 110, 55),
('mkbhd', 'Marques Brownlee', 'Tech reviewer and internet personality.', 'https://placehold.co/400x400/png?text=MKBHD', 'Tech', 45, 40, 88);

INSERT INTO Predictions (id, punditId, statement, date, deadline, outcome, confidence) VALUES
('p1', 'jim-cramer', 'Buy Silicon Valley Bank, it is a buy.', '2023-02-08', '2023-03-10', 'Incorrect', 90),
('p2', 'stephen-a-smith', 'The Knicks will make the Eastern Conference Finals.', '2023-10-15', '2024-05-01', 'Pending', 85),
('p3', 'mkbhd', 'The iPhone 15 will switch to USB-C.', '2023-01-10', '2023-09-12', 'Correct', 99);
