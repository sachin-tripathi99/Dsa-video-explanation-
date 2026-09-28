class Solution {
public:
    int countSubstrings(string s) {
        int n = s.size(), count = 0;
        for (int c = 0; c < 2 * n - 1; c++) {               // letters and gaps
            int l = c / 2, r = l + c % 2;
            while (l >= 0 && r < n && s[l] == s[r]) { count++; l--; r++; }
        }
        return count;
    }
};
