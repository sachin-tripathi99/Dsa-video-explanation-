class Solution {
    int count(vector<int>& b, int day, int k) {              // bouquets of k adjacent bloomed flowers
        int run = 0, n = 0;
        for (int x : b) {
            if (x <= day) { if (++run == k) { n++; run = 0; } }
            else run = 0;
        }
        return n;
    }
public:
    int minDays(vector<int>& bloomDay, int m, int k) {
        if ((long long)m * k > (long long)bloomDay.size()) return -1;   // not enough flowers ever
        int lo = *min_element(bloomDay.begin(), bloomDay.end());
        int hi = *max_element(bloomDay.begin(), bloomDay.end());
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (count(bloomDay, mid, k) >= m) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};
