class Solution {
    public int numDecodings(String s) {
        int prev2 = 1, prev1 = s.charAt(0) == '0' ? 0 : 1;  // dp[i − 2], dp[i − 1]
        for (int i = 2; i <= s.length(); i++) {
            int cur = 0;
            if (s.charAt(i - 1) != '0') cur += prev1;       // last digit alone
            int two = (s.charAt(i - 2) - '0') * 10 + (s.charAt(i - 1) - '0');
            if (s.charAt(i - 2) != '0' && two <= 26) cur += prev2;   // last two digits
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
