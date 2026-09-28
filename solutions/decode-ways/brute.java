class Solution {
    public int numDecodings(String s) {
        return count(s, 0);
    }

    private int count(String s, int i) {                    // ways to decode s[i:]
        if (i == s.length()) return 1;
        if (s.charAt(i) == '0') return 0;                   // no letter starts with 0
        int ways = count(s, i + 1);
        if (i + 1 < s.length() && Integer.parseInt(s.substring(i, i + 2)) <= 26) ways += count(s, i + 2);
        return ways;
    }
}
