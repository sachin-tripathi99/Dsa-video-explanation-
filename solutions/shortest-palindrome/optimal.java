class Solution {
    public String shortestPalindrome(String s) {
        int n = s.length();
        String rev = new StringBuilder(s).reverse().toString();
        String c = s + "#" + rev;                           // # keeps borders within s
        int[] lps = new int[c.length()];
        for (int i = 1, len = 0; i < c.length(); ) {
            if (c.charAt(i) == c.charAt(len)) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        int l = lps[c.length() - 1];                        // longest palindromic prefix
        return rev.substring(0, n - l) + s;
    }
}
