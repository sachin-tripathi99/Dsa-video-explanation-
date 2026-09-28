class Solution {
    private int count = 0;

    public int countArrangement(int n) {
        place(n, 1, new boolean[n + 1]);
        return count;
    }

    private void place(int n, int pos, boolean[] used) {
        if (pos > n) { count++; return; }
        for (int x = 1; x <= n; x++)
            if (!used[x] && (x % pos == 0 || pos % x == 0)) {   // only numbers that fit
                used[x] = true;
                place(n, pos + 1, used);
                used[x] = false;
            }
    }
}
