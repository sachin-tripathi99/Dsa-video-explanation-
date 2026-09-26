class Solution {
    public String removeKdigits(String num, int k) {
        StringBuilder s = new StringBuilder(num);
        for (int r = 0; r < k; r++) {
            int i = 0;
            while (i + 1 < s.length() && s.charAt(i) <= s.charAt(i + 1)) i++;   // first peak
            s.deleteCharAt(i);
        }
        int z = 0;
        while (z < s.length() - 1 && s.charAt(z) == '0') z++;
        String out = s.substring(z);
        return out.isEmpty() ? "0" : out;
    }
}
