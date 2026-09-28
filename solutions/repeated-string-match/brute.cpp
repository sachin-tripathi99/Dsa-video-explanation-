class Solution {
public:
    int repeatedStringMatch(string a, string b) {
        string t;
        for (int k = 1; t.size() <= b.size() + 2 * a.size(); k++) {
            t += a;                                         // k copies of a
            if (t.find(b) != string::npos) return k;
        }
        return -1;
    }
};
