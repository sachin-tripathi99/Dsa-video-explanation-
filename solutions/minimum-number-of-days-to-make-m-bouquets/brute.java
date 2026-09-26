class Solution {
    public int minDays(int[] bloomDay, int m, int k) {
        if ((long) m * k > bloomDay.length) return -1;
        int[] days = Arrays.stream(bloomDay).distinct().sorted().toArray();
        for (int day : days) if (count(bloomDay, day, k) >= m) return day;
        return -1;
    }

    private int count(int[] b, int day, int k) {
        int run = 0, n = 0;
        for (int x : b) {
            if (x <= day) { if (++run == k) { n++; run = 0; } }
            else run = 0;
        }
        return n;
    }
}
