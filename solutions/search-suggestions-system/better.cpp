class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> res;
        for (int i = 1; i <= (int)searchWord.size(); i++) {
            string p = searchWord.substr(0, i);
            int lo = lower_bound(products.begin(), products.end(), p) - products.begin();
            vector<string> cur;
            for (int k = lo; k < min(lo + 3, (int)products.size()) && products[k].compare(0, p.size(), p) == 0; k++) cur.push_back(products[k]);
            res.push_back(cur);
        }
        return res;
    }
};
