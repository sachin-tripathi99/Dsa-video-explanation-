class Solution {
    public boolean validPalindrome(String s) {
        if (isPal(s)) return true;
        for (int i = 0; i < s.length(); i++)
            if (isPal(s.substring(0, i) + s.substring(i + 1))) return true;
        return false;
    }

    private boolean isPal(String t) {
        for (int l = 0, r = t.length() - 1; l < r; l++, r--)
            if (t.charAt(l) != t.charAt(r)) return false;
        return true;
    }
}
