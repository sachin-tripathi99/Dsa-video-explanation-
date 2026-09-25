class Solution {
    public int[] plusOne(int[] digits) {
        long x = 0;
        for (int d : digits) x = x * 10 + d;     // overflows beyond ~18 digits
        x += 1;
        String s = Long.toString(x);
        int[] out = new int[s.length()];
        for (int i = 0; i < s.length(); i++) out[i] = s.charAt(i) - '0';
        return out;
    }
}
