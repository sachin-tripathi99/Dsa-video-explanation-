class Solution {
    int count = 0;
    void place(int n, int pos, vector<bool>& used) {
        if (pos > n) { count++; return; }
        for (int x = 1; x <= n; x++)
            if (!used[x] && (x % pos == 0 || pos % x == 0)) {   // only numbers that fit
                used[x] = true;
                place(n, pos + 1, used);
                used[x] = false;
            }
    }
public:
    int countArrangement(int n) {
        vector<bool> used(n + 1, false);
        place(n, 1, used);
        return count;
    }
};
