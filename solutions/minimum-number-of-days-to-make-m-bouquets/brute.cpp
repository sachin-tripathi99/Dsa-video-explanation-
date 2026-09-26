class Solution {
    int count(vector<int>& b, int day, int k) {
        int run = 0, n = 0;
        for (int x : b) {
            if (x <= day) { if (++run == k) { n++; run = 0; } }
            else run = 0;
        }
        return n;
    }
public:
    int minDays(vector<int>& bloomDay, int m, int k) {
        if ((long long)m * k > (long long)bloomDay.size()) return -1;
        set<int> days(bloomDay.begin(), bloomDay.end());
        for (int day : days) if (count(bloomDay, day, k) >= m) return day;
        return -1;
    }
};
