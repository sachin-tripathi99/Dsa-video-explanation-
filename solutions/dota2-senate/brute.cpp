class Solution {
public:
    string predictPartyVictory(string senate) {
        string s = senate;
        while (true) {
            if (s.find('R') == string::npos) return "Dire";
            if (s.find('D') == string::npos) return "Radiant";
            for (int i = 0; i < (int)s.size(); i++) {
                char me = s[i];
                int j = (i + 1) % s.size();
                while (s[j] == me) j = (j + 1) % s.size();   // next opponent after me
                s.erase(s.begin() + j);
                if (j < i) i--;                                // removal shifted my index
                if (s.find(me == 'R' ? 'D' : 'R') == string::npos) break;
            }
        }
    }
};
