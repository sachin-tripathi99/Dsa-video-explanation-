class Solution {
    public int reverse(int x) {
        String digits = new StringBuilder(Long.toString(Math.abs((long) x))).reverse().toString();
        long r = Long.parseLong(digits) * (x < 0 ? -1 : 1);
        if (r > Integer.MAX_VALUE || r < Integer.MIN_VALUE) return 0;
        return (int) r;
    }
}
