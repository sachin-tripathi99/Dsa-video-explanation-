class Solution {
    public String shortestPalindrome(String s) {
        int n = s.length();
        for (int k = n; k > 0; k--) {
            int l = 0, r = k - 1;
            while (l < r && s.charAt(l) == s.charAt(r)) { l++; r--; }
            if (l >= r) return new StringBuilder(s.substring(k)).reverse() + s;   // s[0..k) is a palindrome
        }
        return s;
    }
}
