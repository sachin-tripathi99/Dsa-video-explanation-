class Solution {
    public String longestPalindrome(String s) {
        int bi = 0, bj = 0, n = s.length();
        for (int c = 0; c < 2 * n - 1; c++) {               // letters and gaps
            int l = c / 2, r = l + c % 2;
            while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) { l--; r++; }
            if (r - l - 2 > bj - bi) { bi = l + 1; bj = r - 1; }   // last matching window
        }
        return s.substring(bi, bj + 1);
    }
}
