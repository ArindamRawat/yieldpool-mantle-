import DepositForm from "../components/DepositForm";
import WithdrawForm from "../components/WithdrawForm";
import ClaimRewards from "../components/ClaimRewards";
import RewardDebug from "../components/RewardDebug";

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DepositForm />
        <WithdrawForm />
        <ClaimRewards />
      </div>
      <RewardDebug />
    </div>
  );
}
