class Solution {
    public int countSubstrings(String s) {
        int n = s.length(), count = 0;
        for (int c = 0; c < 2 * n - 1; c++) {               // letters and gaps
            int l = c / 2, r = l + c % 2;
            while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) { count++; l--; r++; }
        }
        return count;
    }
}
