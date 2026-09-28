class Solution {
    public String longestPalindrome(String s) {
        int bi = 0, bj = 0;
        for (int i = 0; i < s.length(); i++)
            for (int j = i; j < s.length(); j++)
                if (j - i > bj - bi && isPal(s, i, j)) { bi = i; bj = j; }   // every substring
        return s.substring(bi, bj + 1);
    }

    private boolean isPal(String s, int l, int r) {
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}
