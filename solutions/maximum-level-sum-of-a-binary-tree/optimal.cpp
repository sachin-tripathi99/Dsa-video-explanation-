class Solution {
public:
    int maxLevelSum(TreeNode* root) {
        queue<TreeNode*> q;
        q.push(root);
        long long best = LLONG_MIN;
        int ans = 1;
        for (int level = 1; !q.empty(); level++) {
            long long s = 0;
            for (int i = q.size(); i > 0; i--) {
                TreeNode* n = q.front(); q.pop();
                s += n->val;
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
            if (s > best) { best = s; ans = level; }        // strict: smallest level on ties
        }
        return ans;
    }
};
