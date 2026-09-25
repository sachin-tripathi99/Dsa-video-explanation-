class RecentCounter {
    vector<int> all;
public:
    RecentCounter() {}
    int ping(int t) {
        all.push_back(t);
        int count = 0;
        for (int x : all) if (x >= t - 3000) count++;   // rescan everything
        return count;
    }
};
