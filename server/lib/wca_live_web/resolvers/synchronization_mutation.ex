defmodule WcaLiveWeb.Resolvers.SynchronizationMutation do
  alias WcaLive.Competitions
  alias WcaLive.Synchronization
  alias WcaLive.Scoretaking

  def import_competition(_parent, %{input: input}, %{context: %{current_user: current_user}}) do
    with {:ok, competition} <- Synchronization.import_competition(input.wca_id, current_user) do
      {:ok, %{competition: competition}}
    end
  end

  def import_competition(_parent, _args, _resolution), do: {:error, "not authenticated"}

  def synchronize_competition(_parent, %{input: input}, %{context: %{current_user: current_user}}) do
    with {:ok, competition} <- Competitions.fetch_competition(input.id),
         true <-
           Scoretaking.Access.can_scoretake_competition?(current_user, competition) ||
             {:error, "access denied"},
         {:ok, competition} <- Synchronization.synchronize_competition(competition) do
      {:ok, %{competition: competition}}
    end
  end

  def synchronize_competition(_parent, _args, _resolution), do: {:error, "not authenticated"}
end
