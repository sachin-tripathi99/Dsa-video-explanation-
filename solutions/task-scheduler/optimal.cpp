class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int cnt[26] = {0};
        for (char t : tasks) cnt[t - 'A']++;
        int maxF = *max_element(cnt, cnt + 26), cntMax = 0;
        for (int c : cnt) if (c == maxF) cntMax++;
        return max((int)tasks.size(), (maxF - 1) * (n + 1) + cntMax);
    }
};
