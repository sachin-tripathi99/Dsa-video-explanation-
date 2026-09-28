class Solution {
public:
    vector<double> averageOfLevels(TreeNode* root) {
        vector<double> out;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            long long sum = 0;                              // 64-bit: values can be large
            for (int i = 0; i < size; i++) {
                TreeNode* n = q.front(); q.pop();
                sum += n->val;
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
            out.push_back((double)sum / size);
        }
        return out;
    }
};
