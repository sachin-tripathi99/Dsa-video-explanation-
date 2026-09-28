class Solution {
public:
    string longestPalindrome(string s) {
        int bi = 0, bj = 0, n = s.size();
        for (int c = 0; c < 2 * n - 1; c++) {               // letters and gaps
            int l = c / 2, r = l + c % 2;
            while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
            if (r - l - 2 > bj - bi) { bi = l + 1; bj = r - 1; }   // last matching window
        }
        return s.substr(bi, bj - bi + 1);
    }
};
