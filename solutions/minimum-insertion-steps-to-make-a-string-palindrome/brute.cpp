class Solution {
    int ins(const string& s, int i, int j) {
        if (i >= j) return 0;
        if (s[i] == s[j]) return ins(s, i + 1, j - 1);      // ends already mirror
        return 1 + min(ins(s, i + 1, j), ins(s, i, j - 1)); // mirror one end
    }
public:
    int minInsertions(string s) {
        return ins(s, 0, s.size() - 1);
    }
};
