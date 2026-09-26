class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int cnt[26] = {0};
        for (char t : tasks) cnt[t - 'A']++;
        priority_queue<int> heap;                            // remaining counts
        for (int c : cnt) if (c > 0) heap.push(c);
        int time = 0;
        while (!heap.empty()) {
            vector<int> used;
            while ((int)used.size() < n + 1 && !heap.empty()) {   // one cycle: n + 1 different tasks
                used.push_back(heap.top() - 1);
                heap.pop();
            }
            for (int c : used) if (c > 0) heap.push(c);
            time += heap.empty() ? used.size() : n + 1;      // no trailing idle
        }
        return time;
    }
};
