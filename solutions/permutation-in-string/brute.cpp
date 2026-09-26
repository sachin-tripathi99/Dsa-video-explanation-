class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        size_t k = s1.size();
        sort(s1.begin(), s1.end());
        for (size_t i = 0; i + k <= s2.size(); i++) {
            string w = s2.substr(i, k);
            sort(w.begin(), w.end());
            if (w == s1) return true;
        }
        return false;
    }
};
