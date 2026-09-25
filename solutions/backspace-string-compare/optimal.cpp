class Solution {
    int back(const string& s, int i) {                   // index of the next real char at or before i
        int skip = 0;
        while (i >= 0) {
            if (s[i] == '#') { skip++; i--; }
            else if (skip > 0) { skip--; i--; }
            else break;
        }
        return i;
    }
public:
    bool backspaceCompare(string s, string t) {
        int i = s.size() - 1, j = t.size() - 1;
        while (true) {
            i = back(s, i);
            j = back(t, j);
            if (i < 0 || j < 0) return i < 0 && j < 0;   // both must run out together
            if (s[i] != t[j]) return false;
            i--;
            j--;
        }
    }
};
