class Solution {
    public boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        for (int len = 1; len <= n / 2; len++) {
            if (n % len != 0) continue;                     // the block must divide n
            int i = len;
            while (i < n && s.charAt(i) == s.charAt(i - len)) i++;   // equal to the char one block earlier
            if (i == n) return true;
        }
        return false;
    }
}
